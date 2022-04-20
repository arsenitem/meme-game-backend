import { v4 as uuidv4 } from 'uuid';
export default class Question {
    id: string;
    text: string;

    constructor(text: string) {
        this.id = uuidv4();
        this.text = text;
    }
}