import mongodb from "mongodb";
import {Request} from "express";

export default class TmpDemo {
    // Index signature to prevent error TS7017
    [key: string]: any
    public _id: mongodb.ObjectID;
    public firstName: string;
    public lastName: string;
    public position: number;

    constructor() {

    }

    public fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    public static fromObj(obj: any) {
        const demo = TmpDemo.init(obj.firstName, obj.lastName, obj.position);
        demo._id = obj._id;
        return demo;
    }

    public static init(firstName: string, lastName: string, position: number) {
        let demo = new TmpDemo();
        demo.firstName = firstName;
        demo.lastName = lastName;
        demo.position = position;
        return demo;
    }

    public static handleUpdateRequest(request: Request) {
        let demo = TmpDemo.init(request.body.firstName, request.body.lastName, request.body.position);
        let obj = demo.normalize();
        delete obj["_id"];
        return obj;
    }

    public normalize() {
        let obj: any = {};
        for (let prop of ["_id", "firstName", "lastName", "position"]) {
            obj[prop] = this[prop];
        }
        return obj;
    }
}
