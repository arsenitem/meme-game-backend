const { v4: uuidv4 } = require('uuid')
export default class Player {
    id: string;
    name: string;

    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
    }
}