//fungsi untuk update status task
function updateStatus(id, status) {
    /* Fungsi untuk melakukan update status task
    
    parameter:
        id: id dari task (int)
        status: status dari task (boolean)

    */
    const token = GANTI_DENGAN_API_TOKEN_KALIAN
    let xhr = new XMLHttpRequest();
    let url = GANTI_DENGAN_API_KALIAN;
    
    let statusData = JSON.stringify({
        data: {
            status: !status
        }
    })
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.response)
            alertEl.innerHTML = response.message
           
            setTimeout(location.reload(), 200000)
        }
    };
    const alertLoc = document.getElementById("alert-loc")
    const alertEl = document.createElement("div")
    alertEl.setAttribute("class", "alert alert-success")
    alertEl.setAttribute("role", "alert")
    alertLoc.append(alertEl)


    return xhr.send(statusData);
    
}


// cek apakah user telah login
function checkStatus(id) {
    /* Fungsi untuk melakukan pengecekan status
    
    parameter:
        id (int): id dari tasks
    */
    const token = GANTI_DENGAN_API_TOKEN_KALIAN
    let xhr = new XMLHttpRequest();
    let url = GANTI_DENGAN_API_KALIAN;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.response)
            // console.log(response.data.attributes.status)
            //update status tasks
            updateStatus(id, response.data.attributes.status)
        }
    };
    return xhr.send();
}

// Section untuk drag and drop
function allowDrop(event) {
    //cegah perilaku default elemen
    event.preventDefault();

}
function drag(event) {
    //mendeteksi elemen yang di drag dengan melihat id
    event.dataTransfer.setData("data-id", event.target.id);

}

function drop(event) {
    //cegah perilaku default elemen
    event.preventDefault();

    // console.log(event)
    console.log(event.dataTransfer.getData("data-id"))
    // let dataId = event.relatedTarget.attributes["id"];
    const dataId = event.dataTransfer.getData("data-id");
    checkStatus(dataId)
    // event.target.appendChild(document.getElementById(data));
    // let dataId = event.srcElement.lastChild.id
    //cek status tasks & update status
    //refresh page

}

//GET DATA FROM JSON
//seleksi todoITEM untuk menampung selurush item
let todoItem = document.getElementById("todo");
let doneItem = document.getElementById("done");
//fungsi dijalankan ketika window berhasil load
window.onload = function () {
    /* Fungsi yang akan dijalankan ketika page load */
    //buat object ajax dan url data
    const token = GANTI_DENGAN_API_TOKEN_KALIAN
    let xhr = new XMLHttpRequest();
    let url = GANTI_DENGAN_API_KALIAN;
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //masukan response kedalam local storage
            //ambil data dari local storage
            let response = JSON.parse(this.response);
            console.log(response.data)
            //looping seluruh data untuk menampilkan data pada browser
            response.data.forEach((task) => {
                //artikel akan menjadi elemen parent yang akan menampung data
                let article = document.createElement("article");
                //buat button yang akan menampung tombol aksi
                let badgeDelete = document.createElement("button");
                let badgeEdit = document.createElement("button");

                //buat element paragraf dan header 4
                let h4 = document.createElement("h4");
                let p = document.createElement("p");
                //buat title dan desc dari data menjadi child text node pada h4 dan p
                // console.log(data[0].tasks.title)
                h4.appendChild(document.createTextNode(task.attributes.title));
                h4.setAttribute("id", task.id);
                p.appendChild(document.createTextNode(task.attributes.desc));

                //tambahkan konfigurasi html pada artkel
                article.setAttribute("class", "border p-3 mt-3");
                article.setAttribute("ondragstart", "drag(event)");
                article.setAttribute("draggable", "true");
                //berikan attribute id pada artikel
                article.setAttribute("id", task.id);

                //konfigurasi attribute untuk tombol edit dan
                badgeDelete.setAttribute("href", "#");
                badgeDelete.setAttribute("class", "badge bg-danger ");
                badgeDelete.setAttribute("data-id", task.id);
                badgeDelete.setAttribute("data-bs-toggle", "modal");
                badgeDelete.setAttribute("data-bs-target", "#myModalDelete");
                badgeEdit.setAttribute("href", "#");
                badgeEdit.setAttribute("class", "badge bg-info ");
                badgeEdit.setAttribute("data-title", task.attributes.title);
                badgeEdit.setAttribute("data-id", task.id);
                badgeEdit.setAttribute("data-desc", task.attributes.desc);
                badgeEdit.setAttribute("data-bs-toggle", "modal");
                badgeEdit.setAttribute("data-bs-target", "#myModalEdit");

                //append element h4, p , tombol hapus, dan edit menjadi anak artikel
                article.appendChild(h4);
                article.appendChild(p);
                article.appendChild(badgeDelete);
                article.appendChild(badgeEdit);
                //buat tombol delete dan edit memiliki tulisan "delete" dan "edit"
                badgeDelete.appendChild(document.createTextNode("Delete"));
                badgeEdit.appendChild(document.createTextNode("Edit"));

                //append artikel kedalam sebuah todoITem
                // kondisional rendering
                if (task.attributes.status == true) {
                    article.setAttribute("style", "text-decoration: line-through")
                    doneItem.appendChild(article);
                } else {
                    todoItem.appendChild(article);
                }

            });
        }
    };
    xhr.send();
};

//Fungsi ADD
//seleksi tombol tambah
const addForm = document.getElementById("add-form");
addForm.addEventListener("submit", function (event) {
    /* fungsi untuk menambahkan task baru */
    event.preventDefault();
    const token = GANTI_DENGAN_API_TOKEN_KALIAN
    let xhr = new XMLHttpRequest();
    let url = GANTI_DENGAN_API_KALIAN;
    
    //seleksi nilai dari input title dan desc
    let title = document.getElementById("title").value;
    let desc = document.getElementById("description").value;

    //konfigurasi toast
    const toastLiveExample = document.getElementById("liveToastAdd");
    const toastMsgAdd = document.getElementById("toast-body-add");
    const toast = new bootstrap.Toast(toastLiveExample);
    //validasti input
    if (title.trim().length < 0) {
        toastMsgAdd.innerHTML = "Isian title tidak boleh kosong";
        toast.show();
    }
    if (desc.trim().length < 0) {
        toastMsgAdd.innerHTML = "Isian deskripsi tidak boleh kosong";
        toast.show();
    }
    let data = JSON.stringify({
        data:{
            title: title,
            desc: desc
        }
    })
    xhr.open("POST", url, true)
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //close the modal after adding data
            let response = JSON.parse(this.response)
            const myModalAdd = bootstrap.Modal.getInstance("#myModalAdd");
            myModalAdd.hide();
            const alertLoc = document.getElementById("alert-loc")
            const alertEl = document.createElement("div")
            alertEl.setAttribute("class", "alert alert-success")
            alertEl.setAttribute("role", "alert")
            alertEl.innerHTML = response.message

            alertLoc.append(alertEl)

            //reset form
            addForm.reset();
            //refresh page
            setTimeout(location.reload(), 400000)
        }
    };
    xhr.send(data);
});

//fungsi DELETE
// seleksi elemen modal delete
const myModalDelete = document.getElementById("myModalDelete");
//berikan event ketika modal delete muncul
myModalDelete.addEventListener("show.bs.modal", function (event) {
    //mendeteksi elemen yang diklik user
    let dataId = event.relatedTarget.attributes["data-id"];
    // console.log(dataId)
    const deleteForm = document.getElementById("delete-form")
    //ketika tombol delte diklik jalankan fungsi hapus
    deleteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const token = GANTI_DENGAN_API_TOKEN_KALIAN
        let xhr = new XMLHttpRequest();
        let url = GANTI_DENGAN_API_KALIAN;

        xhr.open("DELETE", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.response)

                const myModalDelete = bootstrap.Modal.getInstance("#myModalDelete");
                myModalDelete.hide();

                const alertLoc = document.getElementById("alert-loc")
                const alertEl = document.createElement("div")
                alertEl.setAttribute("class", "alert alert-danger")
                alertEl.setAttribute("role", "alert")
                alertEl.innerHTML = response.message

                alertLoc.append(alertEl)

                setTimeout(location.reload(), 200000)

            }
        };
        xhr.send();
    });
});

// seleksi modal edit
const myModalEdit = document.getElementById("myModalEdit");
// ketika modal edit muncul jalankan fungsi berikut
myModalEdit.addEventListener("show.bs.modal", function (event) {
    //mendapatkan id dari item
    let dataId = event.relatedTarget.attributes["data-id"];
    // console.log(dataId.value)
    //get data with specific id 
    const token = GANTI_DENGAN_API_TOKEN_KALIAN
    let xhr = new XMLHttpRequest();
    let url = GANTI_DENGAN_API_KALIAN;

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.response)
            // console.log(res)
            let oldTitle = document.getElementById("edit-title")
            let oldDesc = document.getElementById("edit-description")
            oldTitle.value = res.data.attributes.title;
            oldDesc.value = res.data.attributes.desc;
            //close the modal after adding data
        }
    };
    xhr.send();
    // let btnEdit = document.getElementById('btn-edit')
    let editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const token = GANTI_DENGAN_API_TOKEN_KALIAN
        let xhr = new XMLHttpRequest();
        let url = GANTI_DENGAN_API_KALIAN; + dataId.value

        let newTitle = document.getElementById("edit-title").value;
        let newdesc = document.getElementById("edit-description").value;
        //konfigurasi toast
        //konfigurasi toast
        const toastLiveExample = document.getElementById("liveToastEdit");
        const toastMsgEdit = document.getElementById("toast-body-edit");
        const toast = new bootstrap.Toast(toastLiveExample);
        //validasi input
        if (newTitle == "") {
            toastMsgEdit.innerHTML = "isian title tidak boleh kosong"
            toast.show()
        }
        if (newdesc == "") {
            toastMsgEdit.innerHTML = "isian desc tidak boleh kosong"
            toast.show()
        }

        let data = JSON.stringify({
            data:{
                title: newTitle,
                desc: newdesc
            }
        })
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.response)
                const alertLoc = document.getElementById("alert-loc")
                const alertEl = document.createElement("div")
                alertEl.setAttribute("class", "alert alert-info")
                alertEl.setAttribute("role", "alert")
                alertEl.innerHTML = response.message                
                alertLoc.append(alertEl)
                //close the modal after edit data
                const myModalEdit = bootstrap.Modal.getInstance("#myModalEdit");
                myModalEdit.hide();
                //reset form and reload page
                editForm.reset();
                setTimeout(location.reload(), 200000)
            }
        };
        xhr.send(data);
    });
});



//fugnsi untuk jam
let p = document.getElementById("jam");

function myTime() {
    let jam = new Date();
    p.innerHTML = jam.toLocaleTimeString([], {
        hour12: false,
    });
}
setInterval(myTime, 1000);
