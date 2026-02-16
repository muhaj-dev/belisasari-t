#!/usr/bin/env node

/**
 * Wojat Platform Master Startup Script
 * Runs all phases of the Wojat memecoin hunting platform
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

class WojatOrchestrator {
  constructor() {
    this.processes = new Map();
    this.isShuttingDown = false;
    this.startTime = Date.now();
    
    // Process configurations
    this.configs = {
      frontend: {
        name: 'Frontend (Phase 1 & 3)',
        command: 'npm',
        args: ['run', 'dev'],
        cwd: path.join(__dirname, 'frontend'),
        port: 3000,
        color: colors.cyan,
        dependencies: []
      },
      phase2: {
        name: 'Twitter-Only Automation (Phase 2)',
        command: 'node',
        args: ['phase2-orchestrator.js'],
        cwd: path.join(__dirname, 'elizaos-agents'),
        port: null,
        color: colors.magenta,
        dependencies: []
      },
      phase4: {
        name: 'AI Trading System (Phase 4)',
        command: 'node',
        args: ['phase4-orchestrator.js'],
        cwd: path.join(__dirname, 'elizaos-agents'),
        port: null,
        color: colors.yellow,
        dependencies: []
      },
      scraper: {
        name: 'Data Collection (TikTok Scraper)',
        command: 'node',
        args: ['index.mjs'],
        cwd: path.join(__dirname, 'js-scraper'),
        port: null,
        color: colors.blue,
        dependencies: []
      }
    };
  }

  // Log with color and timestamp
  log(service, message, type = 'info') {
    const timestamp = new Date().toISOString().substr(11, 12);
    const serviceName = service ? `[${service}]` : '[ORCHESTRATOR]';
    const color = service ? this.configs[service]?.color || colors.white : colors.bright;
    
    let prefix = '';
    switch (type) {
      case 'error':
        prefix = `${colors.red}❌${colors.reset}`;
        break;
      case 'success':
        prefix = `${colors.green}✅${colors.reset}`;
        break;
      case 'warning':
        prefix = `${colors.yellow}⚠️${colors.reset}`;
        break;
      case 'info':
        prefix = `${colors.blue}ℹ️${colors.reset}`;
        break;
      default:
        prefix = `${colors.white}📝${colors.reset}`;
    }
    
    console.log(`${color}${serviceName}${colors.reset} ${prefix} ${message}`);
  }

  // Check if a port is available
  async checkPort(port) {
    return new Promise((resolve) => {
      const net = require('net');
      const server = net.createServer();
      
      server.listen(port, () => {
        server.once('close', () => {
          resolve(true);
        });
        server.close();
      });
      
      server.on('error', () => {
        resolve(false);
      });
    });
  }

  // Install dependencies for a service
  async installDependencies(serviceName) {
    return new Promise((resolve, reject) => {
      this.log(serviceName, 'Installing dependencies...', 'info');
      
      const config = this.configs[serviceName];
      const installProcess = spawn('npm', ['install'], {
        cwd: config.cwd,
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      installProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      installProcess.stderr.on('data', (data) => {
        output += data.toString();
      });

      installProcess.on('close', (code) => {
        if (code === 0) {
          this.log(serviceName, 'Dependencies installed successfully', 'success');
          resolve();
        } else {
          this.log(serviceName, `Failed to install dependencies: ${output}`, 'error');
          reject(new Error(`Installation failed with code ${code}`));
        }
      });
    });
  }

  // Start a service
  async startService(serviceName) {
    const config = this.configs[serviceName];
    
    try {
      // Check if dependencies are installed
      const packageJsonPath = path.join(config.cwd, 'package.json');
      const nodeModulesPath = path.join(config.cwd, 'node_modules');
      
      if (fs.existsSync(packageJsonPath) && !fs.existsSync(nodeModulesPath)) {
        await this.installDependencies(serviceName);
      }

      // Check port availability
      if (config.port) {
        const portAvailable = await this.checkPort(config.port);
        if (!portAvailable) {
          this.log(serviceName, `Port ${config.port} is already in use`, 'warning');
        }
      }

      this.log(serviceName, `Starting ${config.name}...`, 'info');
      
      const childProcess = spawn(config.command, config.args, {
        cwd: config.cwd,
        stdio: 'pipe',
        shell: true,
        env: { ...process.env, NODE_ENV: 'development' }
      });

      // Store process reference
      this.processes.set(serviceName, childProcess);

      // Handle process output
      childProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          this.log(serviceName, line.trim());
        });
      });

      childProcess.stderr.on('data', (data) => {
        const lines = data.toString().split('\n').filter(line => line.trim());
        lines.forEach(line => {
          this.log(serviceName, line.trim(), 'warning');
        });
      });

      childProcess.on('close', (code) => {
        if (!this.isShuttingDown) {
          this.log(serviceName, `Process exited with code ${code}`, code === 0 ? 'success' : 'error');
          this.processes.delete(serviceName);
        }
      });

      childProcess.on('error', (error) => {
        this.log(serviceName, `Process error: ${error.message}`, 'error');
        this.processes.delete(serviceName);
      });

      // Wait a moment for the process to start
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if process is still running
      if (childProcess.killed) {
        this.log(serviceName, `${config.name} failed to start`, 'error');
        return false;
      }

      this.log(serviceName, `${config.name} started successfully`, 'success');
      return true;

    } catch (error) {
      this.log(serviceName, `Failed to start: ${error.message}`, 'error');
      throw error;
    }
  }

  // Start all services
  async startAll() {
    console.log(`${colors.bright}${colors.cyan}`);
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    🚀 IRIS PLATFORM STARTUP 🚀                ║');
    console.log('║              AI-Powered Memecoin Hunting Platform            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`${colors.reset}`);

    this.log(null, 'Initializing Iris Platform...', 'info');
    this.log(null, `Start time: ${new Date().toLocaleString()}`, 'info');

    // Check if we're in the right directory
    if (!fs.existsSync('frontend') || !fs.existsSync('elizaos-agents')) {
      this.log(null, 'Error: Please run this script from the root directory of the Iris project', 'error');
      process.exit(1);
    }

    // Start services in order
    const serviceOrder = ['frontend', 'phase2', 'phase4', 'scraper'];
    
    for (const serviceName of serviceOrder) {
      try {
        await this.startService(serviceName);
        
        // Add delay between service starts
        if (serviceName !== serviceOrder[serviceOrder.length - 1]) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error) {
        this.log(serviceName, `Failed to start ${serviceName}: ${error.message}`, 'error');
        // Continue with other services even if one fails
      }
    }

    // Display status
    this.displayStatus();
    
    // Set up graceful shutdown
    this.setupGracefulShutdown();
  }

  // Display current status
  displayStatus() {
    console.log(`\n${colors.bright}${colors.green}╔══════════════════════════════════════════════════════════════╗`);
    console.log('║                        🎉 IRIS IS RUNNING! 🎉                ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`${colors.reset}`);

    console.log(`\n${colors.bright}📱 Access Points:${colors.reset}`);
    console.log(`   🌐 Main App:     ${colors.cyan}http://localhost:3000${colors.reset}`);
    console.log(`   💬 AI Chat:      ${colors.cyan}http://localhost:3000/ai-chat${colors.reset}`);
    console.log(`   📊 Dashboard:    ${colors.cyan}http://localhost:3000/dashboard${colors.reset}`);
    console.log(`   📈 Trending:     ${colors.cyan}http://localhost:3000/trending-coins${colors.reset}`);
    console.log(`   🧪 Testing:      ${colors.cyan}http://localhost:3000/testing${colors.reset}`);

    console.log(`\n${colors.bright}🤖 Running Services:${colors.reset}`);
    for (const [serviceName, childProcess] of this.processes) {
      const config = this.configs[serviceName];
      const status = childProcess && !childProcess.killed ? '🟢 Running' : '🔴 Stopped';
      console.log(`   ${config.color}${config.name.padEnd(35)}${colors.reset} ${status}`);
    }

    console.log(`\n${colors.bright}⌨️  Controls:${colors.reset}`);
    console.log(`   ${colors.yellow}Ctrl+C${colors.reset}  - Stop all services gracefully`);
    console.log(`   ${colors.yellow}Ctrl+Z${colors.reset}  - Pause all services`);
    console.log(`   ${colors.yellow}Ctrl+\\${colors.reset} - Force stop all services`);

    console.log(`\n${colors.bright}📋 Phase Overview:${colors.reset}`);
    console.log(`   ${colors.cyan}Phase 1:${colors.reset} Data Collection & Display (Frontend)`);
    console.log(`   ${colors.magenta}Phase 2:${colors.reset} Social Media Automation (ElizaOS Agents)`);
    console.log(`   ${colors.cyan}Phase 3:${colors.reset} AI-Powered Frontend (Frontend)`);
    console.log(`   ${colors.yellow}Phase 4:${colors.reset} Advanced AI Trading (ElizaOS Agents)`);

    console.log(`\n${colors.bright}💡 Tips:${colors.reset}`);
    console.log(`   • Check the console logs for real-time updates`);
    console.log(`   • The AI chat interface supports voice commands`);
    console.log(`   • All services will restart automatically if they crash`);
    console.log(`   • Use the dashboard to monitor system performance`);
  }

  // Set up graceful shutdown
  setupGracefulShutdown() {
    const shutdown = async (signal) => {
      if (this.isShuttingDown) return;
      
      this.isShuttingDown = true;
      console.log(`\n${colors.yellow}🛑 Received ${signal}, shutting down gracefully...${colors.reset}`);
      
      const shutdownPromises = [];
      
      for (const [serviceName, childProcess] of this.processes) {
        if (childProcess && !childProcess.killed) {
          this.log(serviceName, 'Stopping service...', 'info');
          shutdownPromises.push(
            new Promise((resolve) => {
              childProcess.on('close', () => {
                this.log(serviceName, 'Service stopped', 'success');
                resolve();
              });
              childProcess.kill(signal === 'SIGTERM' ? 'SIGTERM' : 'SIGINT');
              
              // Force kill after 5 seconds
              setTimeout(() => {
                if (!childProcess.killed) {
                  childProcess.kill('SIGKILL');
                  resolve();
                }
              }, 5000);
            })
          );
        }
      }

      await Promise.all(shutdownPromises);
      
      const runtime = Math.round((Date.now() - this.startTime) / 1000);
      console.log(`\n${colors.green}✅ Wojat Platform stopped successfully after ${runtime} seconds${colors.reset}`);
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGQUIT', () => shutdown('SIGQUIT'));
  }

  // Monitor services and restart if needed
  startMonitoring() {
    setInterval(() => {
      for (const [serviceName, childProcess] of this.processes) {
        if (!childProcess || childProcess.killed) {
          this.log(serviceName, 'Service stopped, attempting restart...', 'warning');
          this.startService(serviceName).catch(error => {
            this.log(serviceName, `Restart failed: ${error.message}`, 'error');
          });
        }
      }
    }, 10000); // Check every 10 seconds
  }
}

// Main execution
async function main() {
  const orchestrator = new WojatOrchestrator();
  
  try {
    await orchestrator.startAll();
    orchestrator.startMonitoring();
  } catch (error) {
    console.error(`${colors.red}❌ Failed to start Wojat Platform: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(`${colors.red}❌ Uncaught Exception: ${error.message}${colors.reset}`);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`${colors.red}❌ Unhandled Rejection at: ${promise}${colors.reset}`);
  console.error(`Reason: ${reason}`);
  process.exit(1);
});

// Start the platform
main();
