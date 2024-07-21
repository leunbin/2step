// 우편번호 검색 기능
document
  .querySelector("button.zipcode-search")
  .addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: function (data) {
        let fullAddr = "";
        let extraAddr = "";

        if (data.userSelectedType === "R") {
          fullAddr = data.roadAddress;
        } else {
          fullAddr = data.jibunAddress;
        }

        if (data.userSelectedType == "R") {
          if (data.bname !== "") {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }

          fullAddr += extraAddr !== "" ? "(" + extraAddr + ")" : "";
        }

        document.querySelector("input[name='shipping-zipcode']").value =
          data.zonecode;
        document.querySelector("input[name='shipping-address']").value =
          fullAddr;
        document.querySelector("input[name='detailedAddress']").focus();
      },
    }).open();
  });
