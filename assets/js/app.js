
const btnSave = document.querySelector(".btn-save");
const btnReset = document.querySelector(".btn-reset");

const txtName = document.querySelector("#name");
const txtClass = document.querySelector("#class");

let idStudent;
let tr;
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
        <tr>
            <td>"Không có sinh viên nào..."</td>
          </tr>
        `
    }
}


const handleClickSave = () => {
    btnSave.addEventListener("click", (e) => {
        e.preventDefault();
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

        if (checkInput >= 2) {
            let dataStudent = {
                name: txtName.value,
                class: txtClass.value,
            }
            if (idStudent) {
                tr.querySelector("td:nth-child(3)").innerText = txtName.value;
                tr.querySelector("td:nth-child(4)").innerText = txtClass.value;
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
    td = e.target.parentNode;
    tr = td.parentNode;
    console.log(tr);
    console.log(idStudent)
    txtName.value = tr.querySelector("td:nth-child(3)").innerText
    txtClass.value = tr.querySelector("td:nth-child(4)").innerText
    // axios
    //     .get(`${studentsAPI}/${id}`)
    //     .then((res) => {
    //         txtName.value = res.data.name;
    //         txtClass.value = res.data.class;
    //         idStudent = id;
    //     })
    //     .catch(err => alert(err.message));
}

const handleDelete = (id, e) => {
    idStudent = id
    td = e.target.parentNode;
    tr = td.parentNode;
    console.log(idStudent);
    tr.remove();
    if (id) {
        console.log("dele");
        axios
            .delete(`${studentsAPI}/${id}`)
            // .then(() => getStudents())
            .catch(err => console.log(err.message));
            idStudent ="";
    }
    return;
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