import { setting as s } from "./setting";
import { help } from "./utils/help";
// import { DDNSV1 } from "./v1";
import { DDNSRunner } from "./runner";
import timexe from 'timexe';
import { logger } from "./utils/logger";

help();

const setting = s();

// if (setting.version === 1) {

//     void new DDNSV1(setting.setting).run();

// } else {

void (async () => {

    if (setting.setting.schedule) {

        logger.info('使用计划任务功能');

        if (setting.setting.schedule.immediate) {

            logger.info('立即执行一次');

            await DDNSRunner.run(setting.setting);

        }

        const result = timexe.add(
            `* * * ${setting.setting.schedule.hour ?? '*'} ${setting.setting.schedule.minute ?? '/5'}`,
            () => {

                logger.info('执行计划任务');

                DDNSRunner
                    .run(setting.setting)
                    .then(() => logger.info('计划任务执行完毕'))
                    .catch((err) => {
                        throw err;
                    });

            }
        );

        if (result.result === 'ok') {

            logger.info('计划任务配置成功');

        } else {

            logger.error(result.error);

            timexe.remove(result.id);

            throw Error('计划任务配置失败');

        }

    } else {

        await DDNSRunner.run(setting.setting);

    }

})();

// }