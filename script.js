

class User{

    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.address = data.address;
        this.phone = data.phone;
    }
    get() {
        return this
    }
    edit(data, elem = this) {
        for(let key in elem) {
            data[key] !== undefined ? elem[key] = data[key] : key
        }
        return elem;
        };
}

class Contacts extends User{
    constructor(data) {
        super(data)
        this.name = data.name;
        this.email = data.email;
        this.address = data.address;
        this.phone = data.phone;
    }
    #data = [];
    #id = 1;
    add(user) {
        user.id = this.#id
        this.#data.push(user)
        this.#id++;
    }
    edit(ids, obj) {
        return this.#data = this.#data.map((value) => value.id === ids ? value = super.edit(obj, value) : value)
    }
    get() {
        return this.#data
    }
    remove(id) {
        return this.#data = this.#data.filter((value) => value.id !== id)
    }
}

let contact = new Contacts({})
contact.add(new User({name: 'alex', email: 'alex@gmail.com', address: 'minsk', phone: 'yes'}))
contact.add(new User({name: 'bob', email: 'alex@gmail.com', address: 'minsk', phone: 'yes'}))
contact.add(new User({name: 'fill', email: 'alex@gmail.com', address: 'minsk', phone: 'yes'}))
contact.add(new User({name: 'john', email: 'alex@gmail.com', address: 'minsk', phone: 'yes'}))
contact.add(new User({name: 'fred', email: 'alex@gmail.com', address: 'minsk', phone: 'yes'}))
contact.edit(4, {phone: 'no', address: 'piter', name: 'zhenya'})
contact.add(new User({name: 'piter', email: 'piter@gmail.com', address: 'moskow', phone: 'yes'}))

contact.remove(3)

console.log(contact.get())

// let user = new User({name: 'fred', email: 'alex@gmail.com', address: 'minsk', phone: 'yes'})
// console.log(user.get())
// console.log(user)
// console.log(user.edit({name: 'fired', email: 'alex@gmail.com', address: 'minsk', phone: 'no'}))

class ContactsApps extends Contacts{
    contact = new Contacts({})
    constructor(data) {
        super(data)
        this.name = data.name;
        this.email = data.email;
        this.address = data.address;
        this.phone = data.phone;
    }
    static create() {
        document.addEventListener('submit', this.onAdd)
        document.addEventListener('click', this.onEdit)
        let elem = document.createElement('div');
        elem.classList.add('contacts')
        elem.innerHTML = `<form>
        <input type="text" name="name" placeholder="input new contact name">
        <input type="email" name="email" placeholder="input new contact email">
        <input type="text" name="address" placeholder="input new contact address">
        <input type="text" name="phone" placeholder="input new contact phone">
        <button type="submit" value="add">add</button>
                </form>
        <div class="contacts__container">
        <button data-type='edit'>edit</button>
        <button data-type='remove'>remove</button>
        </div>`
        document.body.appendChild(elem)
        let container = document.querySelector('.contacts__container')
        let arr = contact.get()
        for(let i = 0; i < arr.length; i++) {
            let div = document.createElement('div')
            div.className = 'contacts__item';
            for(let key in arr[i]) {
                div.innerHTML += `<p data-type=${key}> ${key}: ${arr[i][key]}</p> `
            }
            container.appendChild(div)
        }
        return elem
    }
    static onAdd() {
        event.preventDefault()
        for(let key of event.target) {
            if (key.value === '') {
                return false;
            }
        }
        contact.add(new User({name: event.target.name.value, email: event.target.email.value, address: event.target.address.value, phone: event.target.phone.value}))
        console.log(contact.get())
        let container = document.querySelector('.contacts__container')
        let div = document.createElement('div')
        div.className = 'contacts__item'
        let arr = contact.get()
        for(let key in arr[arr.length - 1]) {
            div.innerHTML += `<p data-type=${key}> ${key}: ${arr[arr.length - 1][key]} </p>`
        }
        container.appendChild(div)
        for(let key of event.target) {
            key.value = '';
        }
        event.target[event.target.length - 1].value = 'edit';
    }
    static onEdit() {
        if(event.target.dataset.type === 'edit') {
            let containerItem = document.querySelectorAll('.contacts__item');
            let container = document.querySelector('.contacts__container')
            for(let key of containerItem) {
                container.removeChild(key)
            }
            let num = +prompt('choose the number of contact')
            let kind = prompt('choose the kind of contact')
            let value = prompt('choose the value of contact')
            if(kind !== 'id') {
                contact.edit(num, {[kind]: value})
            }
            let arr = contact.get()
            for(let i = 0; i < arr.length; i++) {
            let div = document.createElement('div')
            div.className = 'contacts__item';
            for(let key in arr[i]) {
                div.innerHTML += `<p> ${key}: ${arr[i][key]}<p> `
            }
            container.appendChild(div)
        }
        }else if(event.target.dataset.type === 'remove') {
            let num = +prompt('choose the number of contact')
            let regExp = new RegExp(`id: ${num}`, 'i')
            let containerItem = document.querySelectorAll('.contacts__item');
            let container = document.querySelector('.contacts__container')
            for(let key of containerItem) {
                if(key.innerText.match(regExp) !== null) {
                    container.removeChild(key)
                }
            }
            contact.remove(num)
            console.log(contact.get())
        }
    }
    setStorage(key, value) {
        let days = getDay(10)
        window.localStorage.setItem(key, value)
        document.cookie = `storageExpiration=${key} ${value}; max-age=${days}`;
    }
    getStorage(key) {
        return window.localStorage.getItem(key)
    }
    async getData() {
        console.log(this.getStorage('users'))
        // let users = JSON.parse(this.getStorage('users'))
        if (this.getStorage('users')) {
            return false
        }else {
            let url = 'https://jsonplaceholder.typicode.com/users';
            let responce = await fetch(url)
            let data = await responce.json()
    
            for(let key of data) {
                contact.add(new User(key))
            }
            let container = document.querySelector('.contacts__container')
            let containerItem = document.querySelectorAll('.contacts__item');
            let arr = contact.get()
            for(let key of containerItem) {
                container.removeChild(key)
            }
            for(let i = 0; i < arr.length; i++) {
                let div = document.createElement('div')
                div.className = 'contacts__item';
                for(let key in arr[i]) {
                    div.innerHTML += `<p data-type=${key}> ${key}: ${arr[i][key]}</p> `
                }
                container.appendChild(div)
            }
            window.localStorage.setItem('users', JSON.stringify(contact.get()))
            return data;
        }
    }
}
window.localStorage.clear()

let app = new ContactsApps({})
console.log(app.getData())

ContactsApps.create()
function getDay(numDay) {
    return numDay * 86400
}



