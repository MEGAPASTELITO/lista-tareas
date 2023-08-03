const add = document.querySelector('.add');

const IDBRequest = indexedDB.open('database', 1);

IDBRequest.addEventListener('upgradeneeded', () => {
    const db = IDBRequest.result;
    db.createObjectStore('nombres', {
        autoIncrement: true
    });
});

IDBRequest.addEventListener('success', () => {
    writeObject();
});

IDBRequest.addEventListener('error', () => {
    console.log('todo Mal');
});

const addObject = name => {
    const IDBdata = getIDBdata('readwrite');
    IDBdata.add({ nombre: `${name}` });
};

const getIDBdata = mode => {
    const db = IDBRequest.result;
    const IDBtransaction = db.transaction('nombres', mode);
    return IDBtransaction.objectStore('nombres');
};

const writeObject = () => {
    const IDBdata = getIDBdata('readonly');
    const cursor = IDBdata.openCursor();
    let fragmet = document.createDocumentFragment();
    document.querySelector('.body').innerHTML = '';
    cursor.addEventListener('success', () => {
        if (cursor.result) {
            const element = HTMLDoc(cursor.result.key, cursor.result.value.nombre);
            fragmet.appendChild(element);
            cursor.result.continue();
        } else {
            document.querySelector('.body').appendChild(fragmet);
        }
    });
};

const deleteObject = key => {
    const IDBdata = getIDBdata('readwrite');
    IDBdata.delete(key);
};

const modifyObject = (key, ojb) => {
    const IDBdata = getIDBdata('readwrite');
    IDBdata.put({ nombre: `${ojb}` }, key);
};

const HTMLAdd = (type,id,name) =>{
    const container = document.createElement('div');
    const content = document.createElement('div');
    const title = document.createElement('p');
    const label = document.createElement('label');
    const inputName = document.createElement('input');
    const inputAdd = document.createElement('button');

    container.classList.add('add-bg');
    content.classList.add('content-add');
    title.classList.add('title-add');
    inputName.classList.add('input-name');
    inputAdd.classList.add('input-add');

    inputName.type = 'text';



    if (type === 'edit'){
        title.textContent = 'modify name Homework';
    }else if (type === 'add'){
        title.textContent = 'add name Homework';
    }

    if (type === 'edit'){
        inputAdd.textContent = 'edit';
    }else if (type === 'add'){
        inputAdd.textContent = 'ADD';
    }

    if (name !== undefined){
        inputName.value = name;
    }

    label.appendChild(inputName);
    content.appendChild(title);
    content.appendChild(label);
    content.appendChild(inputAdd);
    container.appendChild(content);

    if (type === 'add'){
        inputAdd.addEventListener('click',()=>{
            if (inputName.value.length > 0) {
                addObject(inputName.value);
                writeObject();
                document.body.removeChild(container);
            }else{
                title.textContent += ' require name'
            }
        });
    }
    if (type ==='edit'){
        inputAdd.addEventListener('click',()=>{
            if (inputName.value.length > 0) {
                modifyObject(id,inputName.value);
                writeObject();
                document.body.removeChild(container);
            }else{
                title.textContent += ' require name'
            }
        });
    }

    return container;
}

const HTMLDoc = (id,name) =>{
    const  container = document.createElement('div');
    const  check = document.createElement('div');
    const  title = document.createElement('p');
    const  EditButton = document.createElement('button');

    container.classList.add('list');
    check.classList.add('check');
    title.classList.add('list-title');
    EditButton.classList.add('save');

    title.contenteditable = "true";
    title.textContent = name;
    EditButton.textContent = 'Edit';

    container.appendChild(check);
    container.appendChild(title);
    container.appendChild(EditButton);

    EditButton.addEventListener('click',()=>{
        let window = HTMLAdd('edit',id,title.textContent);
        document.body.appendChild(window);
    })

    check.addEventListener('click',()=>{
        check.classList.replace('check','check-img');
        container.classList.replace('list','list-delete');
        deleteObject(id);
        setTimeout(()=>{
            writeObject();
        },1000)
    })

    return container;
}

add.addEventListener('click',()=>{
    let window = HTMLAdd('add',undefined,undefined);
    document.body.appendChild(window);
});