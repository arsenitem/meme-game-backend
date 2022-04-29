import { v4 as uuidv4 } from 'uuid';
export default class Meme {
    id: string;
    link: string;

    constructor(id: string = uuidv4(), link: string) {
        this.id = id;
        this.link = link;
    }
}