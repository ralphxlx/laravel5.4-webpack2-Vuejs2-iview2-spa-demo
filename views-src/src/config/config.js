let config = {
    productionTip: false,
    debug: true,
    avatar_404: '/images/avatar_404.png',
    cdn: '/',
    api_domain: 'http://laravel541.demo',
    img_url: function (path) {
        return this.cdn + path;
    }
};

export default config;