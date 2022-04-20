import { v4 as uuidv4 } from 'uuid';
export default class Meme {
    id: string;
    blob: Buffer;

    constructor(blob: Buffer) {
        this.id = uuidv4();
        this.blob = blob;
    }
}