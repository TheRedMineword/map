const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let resultfin = null;
    function uidToSlug2ToDec(slice) {
      let out = String(slice ?? "").trim().toLowerCase();
      for (let dec = 0; dec < 256; dec++) {
        const hex = dec.toString(16).padStart(2, "0");
        out = out.split(hex).join(String(dec));
      }
      return out;
    }

    function uidToSlugIndexToLetter(number) {
      const data = Array.from({ length: 100 }, (_, value) => ({
        value,
        letter: ALPHABET[value % 26],
      }));

      let out = `_x_`.replace("x", String(number ?? "").trim());
      for (let i = 0; i < data.length; i++) {
        const token = `_x_`.replace("x", String(data[i].value));
        out = out.replace(token, data[i].letter);
      }
      return out.replaceAll("_", "");
    }

    function xanoSubstr(str, start, len) {
      return String(str ?? "").substr(start, len);
    }

    function convert(uid, seedArray) {
      uid = String(uid ?? "").trim();
      if (!uid) {
        return { slug: "", meta: "Enter a UID to begin.", debug: "" };
      }

      // Xano: split UID into 2-char chunks
      const arrayBase2 = [];
      let is = 0;
      for (let i = 0; i < Math.floor(uid.length / 2); i++) {
        arrayBase2.push(uid.substr(is, 2));
        is += 2;
      }

      // Xano: build decimal string from helper
      let decStrn = "";
      for (let i = 0; i < arrayBase2.length; i++) {
        const func1 = uidToSlug2ToDec(arrayBase2[i]);
        decStrn = (String("$x$y").replace("$y", func1).replace("$x", decStrn));
      }

      const useSeed = Array.isArray(seedArray) && seedArray.length === 7;
      const seedUsed = [];
      const object = {};
      let id = 1;
      const divideBases = [26, 26, 26, 10, 10, 10, 10];

      for (const base of divideBases) {
        let x1;
        if (useSeed) {
          x1 = seedArray[id - 1];
        } else {
          x1 = Math.floor(Math.random() * uid.length);
        }

        seedUsed.push(x1);

        // Xano uses the seed position directly on the built decimal string
        const slice = xanoSubstr(decStrn, x1, 2);
        const sliceNum = Number(slice || 0);
        const valTemp = Math.floor(sliceNum / base);
        const valTemp2 = base * valTemp;
        const remainder = sliceNum - valTemp2;

        object[`_${id}`] = remainder;
        id += 1;
      }

      const l1 = uidToSlugIndexToLetter(object._1);
      const l2 = uidToSlugIndexToLetter(object._2);
      const l3 = uidToSlugIndexToLetter(object._3);

      const letters = ("(" + l1 + ")(" + l2 + ")(" + l3 + ")").replace(/\(|\)/g, "").toUpperCase().substr(0, 3);
      const digits = ("" + object._4 + object._5 + object._6 + object._7).substr(0, 4);
      const slug = "" + letters + "-" + digits;
console.log(slug);
resultfin = slug;
      return slug;
    }

    function parseSeed(value) {
      const raw = String(value ?? "").trim();
      if (!raw) return [];
      return raw.split(/\s*,\s*/).filter(Boolean).map(v => Number(v));
    }

    function run() {
      const uid = "$$REPLACEME$$";
      const seedArray = [23,41,49,28,23,14,16];
console.log(uid);
// console.log(seedArray);
      const result = convert(uid, seedArray);
}
run();
resultfin;