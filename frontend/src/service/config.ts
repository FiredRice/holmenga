import { GetConfig } from 'wailsjs/go/core/App';
import { store } from 'wailsjs/go/models';

class Config implements store.Config {

    public scrollAnim: boolean = false;

    public async init() {
        try {
            const localConfig = await GetConfig();
            Object.entries(localConfig).forEach(([k, v]) => {
                this[k] = v;
            });
        } catch (error) {
            console.log(error);
        }
    }
}

const config = new Config();

export default config;