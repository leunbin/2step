//우편번호검색 기능
document
  .querySelector("button[type='button']")
  .addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: function (data) {
        console.log(data);
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

        document.querySelector("input[name='postalCode']").value =
          data.zonecode;
        document.querySelector("input[name='street']").value = fullAddr;
        document.querySelector("input[name='detailedAddress']").focus();
      },
    }).open();
  });
