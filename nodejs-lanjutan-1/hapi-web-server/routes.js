const rotues = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Home page';
        },
    },
    {
        method: '*',
        path: '/',
        handler: (request, h) => {
            return 'Halaman tidak dapat diakses dengan method tersebut';
        },
    },
    {
        method: 'GET',
        path: '/about',
        handler: (request, h) => {
            return 'About page';
        },
    },
    {
        method: '*',
        path: '/about',
        handler: (request, h) => {
            return 'Halaman tidak dapat diakses dengan method tersebut';
        },
    },
    {
        method: '*',
        path: '/{any*}',
        handler: (request, h) => {
            return 'halaman tidak ditemukan';
        }
    },
    {
        method: 'GET',
        path: '/profile/{username?}',
        handler: (request, h) => {
            const { username = "Stranger!" } = request.params;
            const { lang = "en"} = request.query;
            
            if (lang === 'id') {
                return `Hai, ${username}`;    
            }

            return `Hello, ${username}`;
        }
    },
    {
        method: 'POST',
        path: '/login',
        handler: (request, h) => {
            const { username, password } = request.payload;
            
            return `Welcome ${username}`;
        }
    }
];

module.exports = rotues;