class spin {
    constructor(user, text, tags, quoteThread) {
        this.user = user;
        this.text = text;
        this.tags = tags;
        this.quoteThread = quoteThread;
        this.is_edited = false;
        this.is_respin = false;
        this.likes = 0;
        this.respins = 0;
    }

    get text() {
        return this._text;
    }

    set text(text) {
        if (text.length > 255) {
            console.log("text is too long");
            alert("text is too long");
            return;
        }
        this._text = text;
        this._is_edited = true;
        return;
    }


}