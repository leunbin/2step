const { categoryDAO, productDAO } = require("../data-access");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const { reOrder } = require("../misc/utils");
const prisma = require("../prismaClient");
const { ProductState } = require("@prisma/client");

class CategoryService {
  async createCategory(data) {
    if(!data.name) {
      throw new AppError(
        commonErrors.inputError,
        "name은 필수값입니다.",
        400
      );
    }

    const existing = await categoryDAO.findByCode(prisma, data.code);

    if(existing) {
      throw new AppError(
        commonErrors.resourceDuplicationError,
        "이미 사용하는 코드입니다.",
        409
      )
    }

    const maxOrder = await categoryDAO.findMaxOrder(prisma);
    const nextOrder = (maxOrder ?? 0) + 1;

    return await categoryDAO.create(prisma, {
      name: data.name,
      code: data.code,
      order: nextOrder
    });
  }

  async getCategory(id) {
    const category = await categoryDAO.findById(prisma, id);

    if(!category) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 카테고리가 없습니다.",
        404
      )
    }

    return category;
  }

  async getCategories(options={}) {
    return await categoryDAO.findMany(prisma, options);
  }

  async updateCategory(id, data) {
    const existing = await categoryDAO.findById(prisma, id);
    
    if (!existing) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 카테고리가 존재하지 않습니다.",
        404,
      );
    }
    return await categoryDAO.updateById(prisma, id, data);
  }

  async deleteCategory(id, mode, targetId) {
    const deleteCategory = await categoryDAO.findById(prisma, id);

    if(!deleteCategory) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "삭제할 카테고리가 없습니다.",
        409
      );
    }

    if(mode === 'MOVE_TO_CATEGORY') {
      
      if(!targetId) {
        throw new AppError(
          commonErrors.inputError,
          "MOVE_TO_CATEGORY 모드에서는 targetId가 필요합니다.",
          400
        )
      }
      
      if(targetId === id) {
        throw new AppError(
          commonErrors.inputError,
          "같은 카테고리로는 이동할 수 없습니다.",
          400
        );
      }

      const targetCategory = await categoryDAO.findById(prisma, targetId);

      if(!targetCategory) {
        throw new AppError(
          commonErrors.resourceNotFoundError,
          "targetId 카테고리가 존재하지 않습니다.",
          404
        );
      }
    }


    const result = await prisma.$transaction(async (tx) => {
      switch(mode){
        case 'DISCONTINUE_PRODUCTS':
          await productDAO.updateStateByCategoryId(tx, id, ProductState.DISCONTINUED);
          break;
        case 'MOVE_TO_CATEGORY':
          await productDAO.updateCategoryByCategoryId(tx, id, targetId);
          break;
        default:
          throw new AppError(
            commonErrors.inputError,
            "올바르지 않은 MODE 입니다.",
            400
          )
      }
      await categoryDAO.updateIsActive(tx, id, false);

      return true;
    })

    return result;
  }

  async setInActive(id) {
    const target = await categoryDAO.findById(prisma, id);

    if(!target) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "해당 카테고리가 없습니다.",
        409
      );
    }

    const result = await prisma.$transaction(async (tx) => {

      if(target.isActive) {
        await categoryDAO.updateIsActive(tx, id, false);
      }

      await productDAO.updateStateByCategoryId(tx, id, ProductState.HIDDEN);
      const updated = await categoryDAO.findById(tx, id);

      return updated;
    });

    return result;
  }

  async updateOrder(datas) {
    if(!datas || datas.length === 0) {
      throw new AppError(
        commonErrors.inputError,
        "입력받은 카테고리 목록이 없습니다.",
        400
      );
    }

    const orderList = [];
    const ids = []; 

    datas.forEach((data) => {
      if (!data || typeof data !== "object") {
        throw new AppError(
          commonErrors.argumentError,
          "잘못된 데이터 형식입니다.",
          400
        );
      }

      const { id, order } = data;

      if (typeof id !== "number" || typeof order !== "number"){
        throw new AppError(
          commonErrors.argumentError,
          "id와 order는 숫자여야 합니다.",
          400
        );
      }

      orderList.push(order);
      ids.push(id);
    })

    if(new Set(orderList).size !== orderList.length) {
      throw new AppError(
        commonErrors.argumentError,
        "order 값에 중복이 있습니다.",
        400
      );
    }

    const realIds = await categoryDAO.findMany(prisma, { ids: ids });

    if(realIds.length !== ids.length) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "존재하지 않는 카테고리가 포함되어 있습니다.",
        404
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const items = await categoryDAO.findMany(tx, {
        select: {id: true}
      }); // 오름차순으로 id만 배열로 받음 order = index+1

      const resultList = reOrder(items, datas);

      for(let index = 0; index < resultList.length; index++) {
        const id = resultList[index];
        await categoryDAO.updateById(tx, id, {order: index+1});
      }
      
      return await categoryDAO.findMany(tx, {
        select: { id: true, name: true, order: true }
      });
    });

    return result;
  }

  async mergeCategory(datas, targetId) {
    const ids = datas.map((data) => data.id);
    const sourceCategories = await categoryDAO.findByIds(prisma, ids); //병합 대상들

    if(sourceCategories.length === 0) {
      throw new AppError(
        commonErrors.resourceNotFoundError,
        "입력하신 카테고리들이 없습니다.",
        404
      )
    }

    if(sourceCategories.length !== ids.length) {
      const exsisting = new Set(sourceCategories.map(c => c.id));
      const missing = ids.filter(id => !exsisting.has(id));

      throw new AppError(
        commonErrors.resourceNotFoundError,
        `존재하지 않는 카테고리 id: ${missing.join(", ")}`,
        404
      );
    }

    const usedIds = new Set(sourceCategories.map((category => category.id)));
    if(usedIds.has(targetId)) {
      throw new AppError(
        commonErrors.inputError,
        "병합 대상 ID는 병합 소스 ID 목록에 포함될 수 없습니다.",
        400
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await productDAO.updateCategoryByCategoryIds(tx, ids, targetId);
      await categoryDAO.updateIsActiveByIds(tx, ids);

      const products = await productDAO.findMany(tx, { categoryId: targetId });
      let targeted = [];
      for(const id of ids) {
        const category = await categoryDAO.findById(tx, id);
        targeted.push({
          id: category.id,
          name: category.name,
          isActive: category.isActive
        });
      }

      return {
        newProducts : products,
        targetedCategory: targeted
      }
    });

    return result;
  }
}

module.exports = new CategoryService();
