import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Dashboard',
    icon: 'bx-home-circle',
    link: '/dashboard',
    roles: ['ROLE_USER','ROLE_SUPERADMIN','ROLE_ADMIN']
  },
  {
    id: 2,
    label: 'HEADER.MENU.TIMESHEET',
    icon: 'bx-calendar',
    link: '/timesheet',
    roles: ['ROLE_ADMIN', 'ROLE_USER','ROLE_SUPERADMIN']
  },
  { id: 3,
    label: 'HEADER.MENU.ADMINISTRATION',
    icon: 'bx-notepad',
    roles: ['ROLE_SUPERADMIN'],
    subItems: [
      {
        id: 4,
        label: 'HEADER.MENU.USERS',
        icon:'bx bx-user-plus',
        link: '/users',
        parentId: 3,
        roles: ['ROLE_SUPERADMIN'],
      },
      {
        id: 5,
        label: 'HEADER.MENU.ROLES',
        link: '/roles',
        icon:'bx-user-check',
        parentId: 3,
        roles: ['ROLE_SUPERADMIN'],
      }
    ]
  },
  { id: 4,
    label: 'HEADER.MENU.CONFIGURATIONS',
    icon: 'bx-menu',
    roles: ['ROLE_ADMIN','ROLE_SUPERADMIN'],
    subItems:[{
      id: 6,
      label: 'HEADER.MENU.CLIENTS',
      link: '/clients',
      icon:'bxs-user-pin',
      parentId: 4,
      roles: ['ROLE_ADMIN','ROLE_SUPERADMIN'],
    },
    {
      id: 7,
      label: 'HEADER.MENU.PUBLICHOLIDAY',
      link: '/publicholidays',
      icon: 'bx-home-circle',
      parentId: 4,
      roles: ['ROLE_ADMIN','ROLE_SUPERADMIN'],
    },
    {
      id: 8,
      label: 'HEADER.MENU.CONFIGURATION',
      link: '/configuration',
      icon:'bx-edit',
      parentId: 4,
      roles: ['ROLE_ADMIN','ROLE_SUPERADMIN'],
    },
    {
      id: 9,
      label: 'HEADER.MENU.CONFIGURATIONVALUE',
      roles: ['ROLE_ADMIN','ROLE_SUPERADMIN'],
      parentId : 4,
      subItems:[]
    },
    {
      id: 10,
      label: 'HEADER.MENU.ACTIVITIES',
      link: '/activities',
      icon: 'bx-user-check',
      parentId: 4,
      roles: ['ROLE_ADMIN','ROLE_SUPERADMIN'],
    }]},
];
