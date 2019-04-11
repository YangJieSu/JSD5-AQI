const app = new Vue({
  el: '#app',
  data: {
    allData: [],
    selectCountry: '',
    loading: false,
    updateTime: '',
    detailData: {},
  },
  methods: {
    getAQI() {
      const vm = this;
      const AQI_API = 'https://script.google.com/macros/s/AKfycbwH2Fb3JOsKQETPgXc8xrlIXIYQ26ldyw70dJD5AQXqhwBU7Asp/exec?url=http://opendata.epa.gov.tw/webapi/Data/REWIQA/?format=json';
      vm.selectCountry = '';
      vm.loading = true;
      axios({ method: 'get', url: AQI_API })
        .then((response) => {
          vm.allData = response.data;
          vm.getTime();
          vm.initData();
          vm.loading = false;
        })
        .catch((error) => {
          vm.getTime();
          vm.loading = false;
          console.log(`資料取得失敗:${error}`);
        });
    },
    statusColor(status) {
      let className = '';
      switch (status) {
        case '良好':
          className = 'status-good';
          break;
        case '普通':
          className = 'status-ordinary';
          break;
        case '對敏感族群不健康':
          className = 'status-sensitive';
          break;
        case '對所有族群不健康':
          className = 'status-unhealthy';
          break;
        case '非常不健康':
          className = 'status-unhealthy-hard';
          break;
        case '危害':
          className = 'status-harm';
          break;
        default:
          break;
      }
      return className;
    },
    getTime() {
      const vm = this;
      const now = new Date();
      let month = now.getMonth() + 1;
      if (month < 10) {
        month = `0${month}`;
      }
      vm.updateTime = `${now.getFullYear()}-${month}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    },
    showDetail(item) {
      const vm = this;
      vm.detailData = Object.assign({}, item);
    },
    initData(country = '臺北市') {
      const vm = this;
      vm.detailData = vm.allData.find(item => item.County === country);
    },
  },
  computed: {
    filterCountry() {
      const vm = this;
      const set = new Set();
      vm.allData.forEach((item) => {
        set.add(item.County);
      });
      const countryArray = [...set];
      return countryArray;
    },
    filterCountryData() {
      const vm = this;
      if (vm.selectCountry) {
        vm.initData(vm.selectCountry);
        return vm.allData.filter(item => item.County === vm.selectCountry);
      }
      return vm.allData.filter(item => item);
    },
  },
  created() {
    const vm = this;
    vm.getAQI();
  },
});
