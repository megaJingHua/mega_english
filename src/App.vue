<template>
  <div id="app">
    <div class="container">
      <img alt="Vue logo" src="./assets/logo.png" />
      <b-row class="justify-content-md-center">
        <b-col cols="6">
          <b-input-group prepend="資料庫連結" size="sm">
            <b-form-input
              @input="eventBaseUrl"
              id="input-valid"
              :state="dataBaseCheckt"
              placeholder="輸入 google excel 表單的 .csv 連結"
            ></b-form-input>
          </b-input-group>
        </b-col>
        <p v-if="dataBaseCheckt == false" class="error">{{ dataBaseError }}</p>
      </b-row>

      <b-row class="justify-content-md-center mt-3">
        <b-col cols="6">
          <b-button-group size="md">
            <b-button
              variant="outline-danger"
              @click="$bvModal.show('modal-random-english')"
              :disabled="!dataBaseCheckt"
              >隨機英文單字</b-button
            >
            <b-button variant="outline-secondary" :disabled="true"
              >隨機文法</b-button
            >
            <b-button
              variant="outline-danger"
              :disabled="!dataBaseCheckt"
              @click="$bvModal.show('modal-database-english')"
              >英文單字庫</b-button
            >
            <b-button variant="outline-secondary" :disabled="true"
              >文法庫</b-button
            >
            <b-button variant="outline-secondary" :disabled="true"
              >單字測驗</b-button
            >
            <b-button variant="outline-secondary" :disabled="true"
              >文法測驗</b-button
            >
          </b-button-group>
        </b-col>
      </b-row>
      <!-- 英文單字庫 -->
      <b-modal id="modal-database-english" centered size="lg">
        <template #modal-header="{ cancel }">
          <h3>英文單字庫</h3>

          <b-button variant="light" @click="cancel()">
            <b-icon
              icon="x-circle"
              variant="danger"
              aria-hidden="true"
            ></b-icon>
          </b-button>
        </template>

        <template #default>
          <b-table
            striped
            hover
            :items="allEnglish"
          ></b-table>
        </template>

        <template #modal-footer="{ok}">
          <b-button
            size="sm"
            variant="outline-danger"
            @click="ok()"
            >ok</b-button
          >
        </template>
      </b-modal>
      <!-- 隨機英文單字 -->
      <b-modal id="modal-random-english" centered>
        <template #modal-header="{ cancel }">
          <h3>隨機英文單字</h3>

          <b-button variant="light" @click="cancel()">
            <b-icon
              icon="x-circle"
              variant="danger"
              aria-hidden="true"
            ></b-icon>
          </b-button>
        </template>

        <template #default>
          <b-table
            striped
            hover
            :items="randomEnglish"
            :fields="randomSelected"
          ></b-table>
        </template>

        <template #modal-footer>
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              v-model="randomSelected"
              :options="randomOptions"
              :aria-describedby="ariaDescribedby"
              @change="changeDisplayRandom"
              plain
            ></b-form-checkbox-group>
          </b-form-group>

          <b-button
            size="sm"
            variant="outline-danger"
            @click="handleClickRandom"
            >隨機</b-button
          >
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      dataBaseError: "",
      dataBaseCheckt: null,
      allEnglish: [],
      randomEnglish: [],
      randomSelected: ["chinese", "english", "part_of_speech"],
      randomOptions: [
        { text: "中文", value: "chinese" },
        { text: "英文", value: "english" },
        { text: "詞性", value: "part_of_speech" },
      ],
    };
  },
  methods: {
    async eventBaseUrl(e) {
      this.dataBaseError = "";
      if (e == "") {
        this.dataBaseCheckt = null;
        return;
      }
      try {
        await this.axios
          .get(e)
          .then(({ data }) => {
            this.dataBaseCheckt = true;
            this.allEnglish = this.$papa.parse(data, { header: true }).data;
            this.handleClickRandom();
          })
          .catch((err) => {
            this.dataBaseCheckt = false;
            this.dataBaseError = "請確認資料庫連結是否正確且為.csv";
            console.log(err);
          });
      } catch (error) {
        this.dataBaseCheckt = false;
        this.dataBaseError = "系統錯誤，請聯繫 Mega！";
        console.log(error);
      }
    },
    handleClickRandom() {
      this.randomEnglish = this.getRandomArrayElements(this.allEnglish, 5);
    },
    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },
    changeDisplayRandom(e) {
      this.randomSelected = e.sort();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>
