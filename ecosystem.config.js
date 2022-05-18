
module.exports = {
    apps : [
        {
            name: "web-d",
            script: "npm",
            args: "run start-dev",
            autorestart: true,
            watch: false,
            max_memory_restart: "200M",
            time: true,
            log_date_format: "YYYY-MM-DD HH:mm Z",
            error_file: "/var/log/web/error.log",
            out_file: "/var/log/web/out.log",
            restart_delay: 5000,
            autorestart: true
        },
        {
            name: "web-s",
            script: "npm",
            args: "run start-stage",
            autorestart: true,
            watch: false,
            max_memory_restart: "200M",
            time: true,
            log_date_format: "YYYY-MM-DD HH:mm Z",
            error_file: "/var/log/web/error.log",
            out_file: "/var/log/web/out.log",
            restart_delay: 5000,
            autorestart: true
        },
        {
            name: "web-p",
            script: "npm",
            args: "run start-prod",
            autorestart: true,
            watch: false,
            max_memory_restart: "200M",
            time: true,
            log_date_format: "YYYY-MM-DD HH:mm Z",
            error_file: "/var/log/web/error.log",
            out_file: "/var/log/web/out.log",
            restart_delay: 5000,
            autorestart: true
        }
    ]
};
