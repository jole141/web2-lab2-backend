import { IComment, IPData, User } from "./types";

export const initalComments: IComment[] = [
  {
    id: 1,
    text: "<b>Ovo je komentar</b>",
  },
  {
    id: 2,
    text: "Ovo je još jedan komentar",
  },
];

export let DB_USER: User[] = [
  {
    id: 1,
    name: "Josip Jurenic",
    username: "jjurenic",
    email: "jjurenic@mail.com",
    password: "$2b$10$pQ2ACLjPHUmOcCO8trvo0eBUpLJkJlTWUweZGCci/lycdZhu2dAe6", //password123
    balance: 10000,
  },
  {
    id: 2,
    name: "Admin Admin",
    username: "admin",
    email: "admin@admin.com",
    password: "$2b$10$pQ2ACLjPHUmOcCO8trvo0e/Ezown75QBxdr1RMhZdJHlnnlQEHRgG", //admin
    balance: 10000,
  },
  {
    id: 3,
    name: "Test Test",
    username: "test",
    email: "test@test.com",
    password: "$2b$10$pQ2ACLjPHUmOcCO8trvo0eSaKCLzMIeqh/DUvwWjgDAabnWerzQzu", //sifra123
    balance: 10000,
  },
];

export let DB_IP_DATA: IPData[] = [];

export let DB_COMMENTS: IComment[] = [initalComments[0], initalComments[1]];
