import { currentLocale } from "../i18n";
import { setPageLocale, timeDurationFormatter } from "../util-frontend";
const langModules = import.meta.glob("../lang/*.json");

export default {
    data() {
        return {
            language: currentLocale(),
        };
    },

    async created() {
        if (this.language !== "en") {
            await this.changeLang(this.language);
        }
    },

    watch: {
        async language(lang) {
            await this.changeLang(lang);
        },
    },

    methods: {
        /**
         * Change the application language
         * @param {string} lang Language code to switch to
         * @returns {Promise<void>}
         */
        async changeLang(lang) {
            const loader = langModules["../lang/" + lang + ".json"];
            if (!loader) {
                // Language file not bundled (English-only fork); stay on the fallback (en).
                return;
            }
            let message = (await loader()).default;
            this.$i18n.setLocaleMessage(lang, message);
            this.$i18n.locale = lang;
            localStorage.locale = lang;
            setPageLocale();
            timeDurationFormatter.updateLocale(lang);
        },
    },
};
