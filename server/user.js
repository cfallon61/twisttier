class user {

    constructor(id, email, username, password) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        //this.signUpDate = getCurrentTime();
        //this.lastLogin = ?
        this.bio = "";
        this.name = "";
        //this.
    }

    set bio(bio) {
        if (bio.length > 100) {
            console.log("bio is too long");
            alert("bio is too long");
            return;
        }
        this.bio = bio;
        return;
    }

    set name(name) {
        if (name.length > 35) {
            console.log("name is too long");
            alert("name is too long");
            return;
        }
        this.name = name;
        return;
    }
}