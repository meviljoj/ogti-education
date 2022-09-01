import Person from '@mui/icons-material/Person';
import Analytics from '@mui/icons-material/Analytics';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupsIcon from '@mui/icons-material/Groups';

const sidebarElements = [
    {
        icon: ArrowBackIcon,
        desc: 'Назад',
        navigateLink: '/courses/list',
    },
    {
        icon: GroupsIcon,
        desc: 'Группы',
        navigateLink: '/admin/groups/list',
    },
    {
        icon: EditIcon,
        desc: 'Редактировать курсы',
        navigateLink: '/admin/courses/list',
    },

    {
        icon: Person,
        desc: 'Пользователи',
        navigateLink: '/admin/users/students',
    },
    {
        icon: Analytics,
        desc: 'Статистика',
        navigateLink: '/admin/analytics',
    },
];

export default sidebarElements;