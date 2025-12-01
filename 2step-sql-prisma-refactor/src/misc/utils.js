const AppError = require("./AppError");
const commonErrors = require("./commonErrors");

function sanitizeObject(obj) {
  const result = Object.entries(obj).reduce((map, [key, value]) => {
    if (value !== undefined) {
      map[key] = value;
    }
    return map;
  }, {});
  return result;
}

function buildResponse(data, errorMessage) {
  return {
    error: errorMessage ?? null,
    data,
  };
}

function isDuplicated(options) {
  if(options.length === 0) {
    return false;
  }

  const set = new Set();
  options.forEach((opt) =>{
    set.add(`${opt.size}_${opt.color}`)
  });

  if(options.length !== set.size) {
    return true;
  }

  return false;
}

function reOrder(beforeItems, inputItems) {
  const result = [];
  //1) 입력 받은 값들 order 기반으로 배열에 삽입
  inputItems.forEach((inputItem) => {
    result[inputItem.order - 1] = inputItem.id;
  })

  //2) 이미 사용한 data 삽입
  const usedData = new Set(inputItems.map(item => item.id));

  let itemIndex = 0;
  //3) 기존 요소들 빈 배열 위치에 삽입하기
  beforeItems.forEach((beforeItem) => {
    if(usedData.has(beforeItem.id)) return;

    while(result[itemIndex] !== undefined) {
      itemIndex++;
    }

    result[itemIndex] = beforeItem.id;
  })

  return result;
}

function createValidation(payload, { type }) {
  const rules = {
    delivery: ["name", "phone", "postcode", "address"],
    customer: ["name", "phone", "email"], 
  };

  const fields = rules[type];
  const missing = []

  if(!fields) {
    throw new Error(
      commonErrors.argumentError,
      `Unknown validation type: ${type}`,
      400
    );
  }

  for (const field of fields) {
    if(!payload[field]) {
      missing.push(field);
    }
  }

  if(missing.length > 0) {
    throw new AppError(
      commonErrors.inputError,
      `${type === "delivery" ? "배송" : "수령인"} 필수값 누락: ${missing.join(", ")}`,
      400
    )
  }
}

function updateValidation(payload, { type }) {
  if(!payload ) return;

  const rules = {
    order: ["totalPrice", "status"],
    delivery: ["name", "phone", "postcode", "address"],
    customer: ["name", "phone", "email"],
  };

  const fields = rules[type];

  if(!fields) {
    throw new Error(
      commonErrors.argumentError,
      `Unknown validation type: ${type}`,
      400
    );
  }

  for(const field of fields) {
    if(payload[field] !== undefined){
      if(typeof payload[field] !== "string" || !payload[field].trim()) {
        throw new AppError(
          commonErrors.argumentError,
          `${field}은(는) 빈 값일 수 없습니다.`,
          400
        );
      }
    }
  }
}

module.exports = {
  sanitizeObject,
  buildResponse,
  isDuplicated,
  reOrder,
  createValidation,
  updateValidation
};
