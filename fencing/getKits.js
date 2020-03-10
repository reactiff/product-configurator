import wood from './kits/wood';
import vinyl from './kits/vinyl';

export default () => {
    return new Promise((resolve, reject) => {

        const response = {
            ok: true,
            data: [
                vinyl,
                wood, 
            ],
        };

        resolve(response);
            

        
    });
}