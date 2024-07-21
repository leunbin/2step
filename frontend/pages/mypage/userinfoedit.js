async function updateProfile() {
  const email = document.querySelector(".email").value;
  const newPassword = document.querySelector(".new-password").value;
  const lastname = document.querySelector(".lastname").value;
  const firstname = document.querySelector(".firstname").value;
  const postalCode = document.querySelector(".postalCode").value;
  const detailedAddress = document.querySelector(".detailedAddress").value;
  const street = document.querySelector(".street").value;

  const address = {
    detailedAddress: detailedAddress,
    street: street,
    postalCode: postalCode,
  };

  const data = {
    email: email,
    password: newPassword,
    lastName: lastname,
    firstName: firstname,
    address,
  };

  try {
    console.log(data);
    const token = localStorage.getItem("token");
    const res = await fetch(
      "http://kdt-sw-8-team02.elicecoding.com/api/v1/me",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      alert("회원 정보 수정 되었습니다.");
      location.reload();
    } else {
      throw new Error("통신 에러");
    }
  } catch (e) {
    console.error(e);
  }
}

export default updateProfile;
