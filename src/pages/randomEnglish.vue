<template>
  <div>
    <h1>隨機英文單字</h1>
    <div v-for="(item, i) in randomEnglish" :key="i">
      <p>{{ item.english }} ({{ item.part_of_speech }}){{ item.chinese }}</p>
    </div>
    <b-button variant="outline-danger" @click="handleClickRandom">random</b-button>
  </div>
</template>

<script>
export default {
  name: "randomEnglish",
  data() {
    return {
      allEnglish: [],
      randomEnglish: [],
    };
  },
  mounted() {
    this.getEnglishData();
    console.log(this.allEnglish);
  },
  methods: {
    getEnglishData() {
      this.axios
        .get(localStorage.getItem("dataBaseCheckt"))
        .then((e) => {
          this.allEnglish = this.$papa.parse(e.data, { header: true }).data;
          this.handleClickRandom();
        });
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
