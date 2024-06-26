import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { DDNSSetting } from "./interface";
import { validateSetting } from "./services/settings-validate";
import { logger } from "./utils/logger";


interface Setting {
    version: 2
    setting: DDNSSetting
}

export function setting(): Setting {

    const settingPath = join(process.cwd(), 'settings.json');
    logger.debug(`配置文件路径：${settingPath}`);

    let settingObj: DDNSSetting;

    try {
        if(!existsSync(settingPath)){
            throw Error(`配置文件不存在，请检查，路径：${settingPath}`);
        }
        settingObj = JSON.parse(readFileSync(settingPath, 'utf-8')) as DDNSSetting;

    } catch (error) {

        throw Error(`配置文件解析错误`);

    }

    if (typeof settingObj !== 'object') {

        throw Error(`配置文件不合规范`);

    }

    if (settingObj && settingObj.version && settingObj.version === 2) {

        logger.debug(settingObj);

        const v = validateSetting();

        const valid = v(settingObj);

        if (!valid) {

            if (v.errors) {

                logger.error(`配置文件有${v.errors.length}个错误`);

                v.errors.forEach(v => logger.error(v));

            } else {

                logger.error('未知错误');

            }

            process.exit(1);

        }

        return {
            version: 2,
            setting: settingObj
        };
    } else {
        logger.error('不再支持v1版本配置和运行方式，请迁移到v2版本的配置和运行方式！');
        throw Error('不再支持v1版本配置和运行方式，请迁移到v2版本的配置和运行方式！');
    }

}

