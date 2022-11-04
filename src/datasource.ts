interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface UserSecured {
  id: number;
  name: string;
  email: string;
  password: string;
  wrongLoginAttempts: number;
  lockedUntil: Date;
}

export const DB: User[] = [
  {
    id: 1,
    name: "Josip Jurenic",
    email: "jjurenic@mail.com",
    password: "$2b$10$pQ2ACLjPHUmOcCO8trvo0eBUpLJkJlTWUweZGCci/lycdZhu2dAe6", //password123
  },
  {
    id: 2,
    name: "Admin Admin",
    email: "admin@admin.com",
    password: "$2b$10$pQ2ACLjPHUmOcCO8trvo0e/Ezown75QBxdr1RMhZdJHlnnlQEHRgG", //admin
  },
  {
    id: 3,
    name: "Test Test",
    email: "test@test.com",
    password: "$2b$10$pQ2ACLjPHUmOcCO8trvo0eSaKCLzMIeqh/DUvwWjgDAabnWerzQzu", //sifra123
  },
];
