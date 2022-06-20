const btnSave = document.querySelector(".btn-save");
const btnReset = document.querySelector(".btn-reset");

const txtUserName = document.querySelector("#user-name");
const txtFullName = document.querySelector("#full-name");
const txtEmail = document.querySelector("#email");
const txtBirthday = document.querySelector("#birthday");


btnSave.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(txtBirthday.value);
})

btnReset.addEventListener("click", (e) => {
    e.preventDefault();
    txtUserName.value = "";
    txtFullName.value = "";
    txtEmail.value = "";
    txtBirthday.value = "";
})