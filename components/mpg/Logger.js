var __logger_data = {
    indentation: 0,
};

export default class Logger {

    indent() {
        __logger_data.indentation = __logger_data.indentation + 2;
    }

    unindent() {
        __logger_data.indentation = __logger_data.indentation - 2;
        if(__logger_data.indentation < 0) {
            console.error('Negative indentation');
        }
    }

    log(message) {
        const prefix = Array(__logger_data.indentation).fill(' ').join('');
        console.log(prefix + message);
    }

    startGroup(message) {
        const prefix = Array(__logger_data.indentation).fill(' ').join('');
        console.log(prefix + message);
        this.indent();
    }

    endGroup(message) {
        const prefix = Array(__logger_data.indentation).fill(' ').join('');
        console.log(prefix + message);
        this.unindent();
        //console.groupEnd();
    }
}