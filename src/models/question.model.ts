import { v4 as uuidv4 } from 'uuid';
export default class Question {
    id: string;
    text: string;

    constructor(id: string = uuidv4(), text: string) {
        this.id = id;
        this.text = text;
    }

}