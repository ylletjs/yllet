import Client from 'yllet';

const Yllet = {
  install (Vue, options) {
    let client;

    if (options instanceof Client) {
      client = options;
    } else {
      client = new Client(options);
    }

    Vue.prototype.$yllet = client;
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Yllet)
}

export default Yllet;
