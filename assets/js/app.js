
const btnSave = document.querySelector(".btn-save");
const btnReset = document.querySelector(".btn-reset");

const txtName = document.querySelector("#name");
const txtClass = document.querySelector("#class");

let idStudent;
let trUpdate;
const studentsAPI = "https://62affd42b0a980a2ef47ae7c.mockapi.io/students";

const handleClickReset = () => {
    btnReset.addEventListener("click", (e) => {
        e.preventDefault();
        let errors = document.querySelectorAll("small");
        errors.forEach(ele => {
            ele.classList.remove("error");
        })
        txtName.value = "";
        txtClass.value = "";
    })
}

const getStudents = () => {
    axios
        .get(studentsAPI)
        .then(res => {
            renderStudents(res.data);
        })
        .catch(err => console.log(err.message));
}


const renderStudents = (students) => {
    const tbody = document.querySelector("tbody");
    if (students.length > 0) {
        let htmls = students.map((student, index) => {
            return `
            <tr>
                <td>${index + 1}</td>
                <td>${student.studentID}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td><button class="btn btn-edit" onclick="handleUpdate(${student.studentID},event)">Sửa</button></td>
                <td><button class="btn btn-delete" onclick="handleDelete(${student.studentID},event)">Xóa</button></td>
              </tr>
            `
        })
        tbody.innerHTML = htmls.join("");
    }
    else {
        tbody.innerHTML = `
        <tr class="no-student">
            <td colspan ="6" >"Không có sinh viên nào..."</td>
          </tr>
        `
    }
}


const handleClickSave = () => {
    btnSave.addEventListener("click", (e) => {
        e.preventDefault();
        let noStudent = document.querySelector(".no-student");
        if (noStudent) {
            noStudent.remove();
        }
        if (checkValidate() >= 2) {
            let dataStudent = {
                name: txtName.value.trim(),
                class: txtClass.value.trim(),
            }
            if (idStudent) {
                trUpdate.querySelector("td:nth-child(3)").innerText = txtName.value.trim();
                trUpdate.querySelector("td:nth-child(4)").innerText = txtClass.value.trim();
                txtName.value = "";
                txtClass.value = "";
                axios
                    .put(`${studentsAPI}/${idStudent}`, dataStudent)
                    .catch(err => alert(err.message));
                idStudent = "";
            }
            else {
                console.log(false);
                axios
                    .post(studentsAPI, dataStudent)
                    .then((res) => {
                        console.log(res);
                        const trs = document.querySelectorAll("tr");
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${trs.length}</td>
                            <td>${res.data.studentID}</td>
                            <td>${res.data.name}</td>
                            <td>${res.data.class}</td>
                            <td><button class="btn btn-edit" onclick="handleUpdate(${res.data.studentID},event)">Sửa</button></td>
                            <td><button class="btn btn-delete" onclick="handleDelete(${res.data.studentID},event)">Xóa</button></td>
                        `;
                        document.querySelector("tbody").append(tr);
                        txtName.value = "";
                        txtClass.value = "";
                    })
                    .catch(err => console.log(err.message));
            }

        }
    })
}

const handleUpdate = (id, e) => {
    idStudent = id
    let td = e.target.parentNode;
    trUpdate = td.parentNode;
    console.log(idStudent)
    txtName.value = trUpdate.querySelector("td:nth-child(3)").innerText
    txtClass.value = trUpdate.querySelector("td:nth-child(4)").innerText
}

const handleDelete = (id, e) => {
    idStudent = id
    let td = e.target.parentNode;
    let tr = td.parentNode;
    console.log(idStudent);
    tr.remove();
    const trSTTs = document.querySelectorAll("tbody tr td:first-child");
    trSTTs.forEach((item, index) => {
        item.innerText = index + 1;
    })
    if (id) {
        console.log("dele");
        axios
            .delete(`${studentsAPI}/${id}`)
            .catch(err => console.log(err.message));

        idStudent = "";
    }
    if (trSTTs.length < 1) {
        document.querySelector('tbody').innerHTML = `
        <tr class="no-student">
        <td colspan ="6" >"Không có sinh viên nào..."</td>
      </tr>
    `
    }
}

const checkValidate = () => {
    let checkInput = 0;
    if (!isEmpty(txtName.value)) {
        txtName.parentNode.querySelector("small").innerText = "Không bỏ trống..."
        txtName.parentNode.querySelector("small").classList.add("error");
    }
    else {
        txtName.parentNode.querySelector("small").classList.remove("error");
        checkInput += 1;
    }

    if (!isEmpty(txtClass.value)) {
        txtClass.parentNode.querySelector("small").innerText = "Không bỏ trống..."
        txtClass.parentNode.querySelector("small").classList.add("error");
    }
    else {
        txtClass.parentNode.querySelector("small").classList.remove("error");
        checkInput += 1;
    }
    return checkInput;
}

const isEmpty = (value) => {
    if (value) return true;
    return false;
}

const start = () => {
    getStudents();
    handleClickSave();
    handleClickReset();
};
start();