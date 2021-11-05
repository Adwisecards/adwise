module.exports = {
    apps : [{
        name: "adwise",
        script: "./dist/index.js",
        instances  : 1,
        error_file: ".logs/err.log",
        out_file: ".logs/out.log",
        log_file: ".logs/combined.log",
        time: true,
        exec_mode  : "cluster",
        node_args: ["--expose-gc", "--max_old_space_size=6500"],
        env: {
            NODE_ENV: "production",
        },
        env_production: {
            NODE_ENV: "production",
        },
        env_test: {
            NODE_ENV: "test",
        }
    }]
};
