<template>
  <div>
    <h1>隨機英文單字</h1>
    <div v-for="(item, i) in randomEnglish" :key="i">
      <p>{{ item.english }} ({{ item.part_of_speech }}){{ item.chinese }}</p>
    </div>
    <button type="button" @click="handleClickRandom">random</button>
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
        .get(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9A2cjX-BE7vBbMgGlJdR9HU1AyfVHtQ-0DBNCk4HldodGRyh13_Nrmfk0sDx1Le-tsZf36BRrKxma/pub?gid=0&single=true&output=csv"
        )
        .then((e) => {
          this.allEnglish = this.$papa.parse(e.data, { header: true }).data;
          console.log(this.allEnglish)
          this.handleClickRandom();
        });
    },
    handleClickRandom() {
        console.log("handleClickRandomhandleClickRandom")
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
