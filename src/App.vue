<template>
  <div id="app">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col cols="12" lg="4">
          <img alt="Vue logo" src="./assets/logo.png" style="width: 100%" />
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col cols="12" lg="6">
          <b-input-group prepend="單字資料庫" size="sm">
            <b-form-input
              @input="eventBaseUrl"
              v-model="dataBaseUrl"
              id="input-valid"
              :state="dataBaseCheckt"
              placeholder="輸入 google excel 表單的 .csv 連結"
            ></b-form-input>
          </b-input-group>
        </b-col>
        <p v-if="dataBaseCheckt == false" class="error">{{ dataBaseError }}</p>
      </b-row>

      <b-row class="justify-content-center mt-3">
        <b-col>
          <b-button-group size="md">
            <b-button
              variant="outline-success"
              @click="$bvModal.show('modal-random-english')"
              :disabled="!dataBaseCheckt"
              >隨機英文單字</b-button
            >
            <b-button
              variant="outline-success"
              :disabled="!dataBaseCheckt"
              @click="$bvModal.show('modal-database-english')"
              >英文單字庫</b-button
            >
            <b-button variant="outline-secondary" :disabled="true"
              >單字測驗</b-button
            >
          </b-button-group>
        </b-col>
      </b-row>

      <!-- 文法 -->
      <b-row class="justify-content-center mt-4">
        <b-col cols="12" lg="6">
          <b-input-group prepend="文法與片語資料庫" size="sm">
            <b-form-input
              @input="eventGrammarBaseUrl"
              v-model="grammarDataBaseUrl"
              id="input-valid"
              :state="grammarDataBaseCheckt"
              placeholder="輸入 google excel 表單的 .csv 連結"
            ></b-form-input>
          </b-input-group>
        </b-col>
        <p v-if="grammarDataBaseCheckt == false" class="error">
          {{ grammarDataBaseError }}
        </p>
      </b-row>

      <b-row class="justify-content-center mt-3">
        <b-col>
          <b-button-group size="md">
            <b-button
              variant="outline-danger"
              :disabled="true"
              >隨機文法與片語</b-button
            >
            <b-button
              variant="outline-danger"
              :disabled="!grammarDataBaseCheckt"
              @click="$bvModal.show('modal-database-grammar')"
              >文法與片語庫</b-button
            >
            <b-button variant="outline-secondary" :disabled="true"
              >文法與片語測驗</b-button
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
          <b-table striped hover :items="allEnglish"></b-table>
        </template>

        <template #modal-footer="{ ok }">
          <b-button size="sm" variant="outline-success" @click="ok()"
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
              @change="changeDisplayRandomGammar"
              plain
            ></b-form-checkbox-group>
          </b-form-group>

          <b-button
            size="sm"
            variant="outline-success"
            @click="handleClickRandom"
            >隨機</b-button
          >
        </template>
      </b-modal>

      <!-- 文法與片語庫 -->
      <b-modal id="modal-database-grammar" centered size="lg">
        <template #modal-header="{ cancel }">
          <h3>文法與片語庫</h3>

          <b-button variant="light" @click="cancel()">
            <b-icon
              icon="x-circle"
              variant="danger"
              aria-hidden="true"
            ></b-icon>
          </b-button>
        </template>

        <template #default>
          <div>
            <b-table-simple small hover>
              <b-thead head-variant="dark">
                <b-tr>
                  <b-th>文法</b-th>
                  <b-th>Creat Date</b-th>
                  <b-th>Creat Who</b-th>
                </b-tr>
              </b-thead>
              <b-tbody v-for="(item, i) in allGrammar" :key="i">
                <b-tr>
                  <b-td><span style="font-weight:700">{{item.grammar}}</span> <br /> {{item.chinese}}</b-td>
                  <b-th rowspan="4" style="font-weight:500">{{item.create_date}}</b-th>
                  <b-th rowspan="4" style="font-weight:500">{{item.create_who}}</b-th>
                </b-tr>
                <b-tr>
                  <b-td><span style="font-weight:700">{{ item.english_example}}</span> <br /> {{item.chinese_example}}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </div>
        </template>

        <template #modal-footer="{ ok }">
          <b-button size="sm" variant="outline-success" @click="ok()"
            >ok</b-button
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
      dataBaseUrl: "",
      dataBaseCheckt: null,
      allEnglish: [],
      randomEnglish: [],
      randomSelected: ["chinese", "english", "part_of_speech"],
      randomOptions: [
        { text: "中文", value: "chinese" },
        { text: "英文", value: "english" },
        { text: "詞性", value: "part_of_speech" },
      ],

      grammarDataBaseError: "",
      grammarDataBaseUrl: "",
      grammarDataBaseCheckt: null,
      allGrammar: [],
      randomGrammar: [],
    };
  },
  mounted() {
    const url = localStorage.getItem("dataBaseUrl");
    if (url) {
      this.dataBaseUrl = url;
      this.eventBaseUrl(url);
    }

    const grammarUrl = localStorage.getItem("grammarDataBaseUrl");
    if (grammarUrl) {
      this.grammarDataBaseUrl = grammarUrl;
      this.eventGrammarBaseUrl(grammarUrl);
    }
  },
  methods: {
    async eventBaseUrl(e) {
      this.dataBaseError = "";
      if (e == "") {
        this.dataBaseCheckt = null;
        return;
      }
      if (e.indexOf("csv") < 0) {
        this.dataBaseCheckt = false;
        this.dataBaseError = "請確認資料庫連結是否正確且為.csv";
        return;
      }
      try {
        await this.axios
          .get(e)
          .then(({ data }) => {
            localStorage.removeItem("dataBaseUrl")
            this.dataBaseCheckt = true;
            this.allEnglish = this.$papa.parse(data, { header: true }).data;
            localStorage.setItem("dataBaseUrl", this.dataBaseUrl);
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
    async eventGrammarBaseUrl(e) {
      this.grammarDataBaseError = "";
      if (e == "") {
        this.grammarDataBaseCheckt = null;
        return;
      }
      if (e.indexOf("csv") < 0) {
        this.grammarDataBaseCheckt = false;
        this.grammarDataBaseError = "請確認資料庫連結是否正確且為.csv";
        return;
      }
      try {
        await this.axios
          .get(e)
          .then(({ data }) => {
            localStorage.removeItem("grammarDataBaseUrl")
            this.grammarDataBaseCheckt = true;
            this.allGrammar = this.$papa.parse(data, { header: true }).data;
            localStorage.setItem("grammarDataBaseUrl", this.grammarDataBaseUrl);
            this.handleClickRandom();
          })
          .catch((err) => {
            this.grammarDataBaseCheckt = false;
            this.grammarDataBaseError = "請確認資料庫連結是否正確且為.csv";
            console.log(err);
          });
      } catch (error) {
        this.grammarDataBaseCheckt = false;
        this.grammarDataBaseError = "系統錯誤，請聯繫 Mega！";
        console.log(error);
      }
    },
    handleClickRandom() {
      this.randomEnglish = this.getRandomArrayElements(this.allEnglish, 5);
    },

    handleGrammarClickRandom() {
      this.randomGrammar = this.getRandomArrayElements(this.allGrammar, 5);
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
