const allRoles: { user: string[]; admin: string[] } = {
    user: [],
    admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

export { roles, roleRights };
