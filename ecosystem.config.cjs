module.exports = {
    apps: [
        {
            name: "next-app",
            cwd: "C:/Users/Artour/Desktop/saas-admin-dashboard",
            script: "node_modules/next/dist/bin/next",
            args: "start",
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};