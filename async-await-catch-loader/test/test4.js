const vueComponent = {
    methods: {
        async func() {
            await new Promise((resolve, reject) => {
                reject('抛出错误');
            });
        }
    }
};
