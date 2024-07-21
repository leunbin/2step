function showPostcodeSearch() {
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

      document.querySelector("input[class='postalCode']").value = data.zonecode;
      document.querySelector("input[class='street']").value = fullAddr;
      document.querySelector("input[class='detailedAddress']").focus();
    },
  }).open();
}

export default showPostcodeSearch;
