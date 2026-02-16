#!/usr/bin/env node

/**
 * Twitter-Only Wojat Platform Startup Script
 * Runs only the Twitter automation system
 */

const { spawn } = require('child_process');
const path = require('path');

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

class TwitterOnlyOrchestrator {
  constructor() {
    this.processes = new Map();
    this.isShuttingDown = false;
    this.startTime = Date.now();
    
    // Process configurations
    this.configs = {
      twitter: {
        name: 'Twitter-Only Automation',
        command: 'node',
        args: ['twitter-only-orchestrator.js'],
        cwd: path.join(__dirname, 'elizaos-agents'),
        port: null,
        color: colors.magenta,
        dependencies: []
      }
    };
  }

  // Log with color and timestamp
  log(service, message, type = 'info') {
    const timestamp = new Date().toISOString().substr(11, 12);
    const color = this.configs[service]?.color || colors.white;
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    
    console.log(`${color}[${service}]${colors.reset} ${icon} ${message}`);
  }

  // Start a service
  async startService(serviceName) {
    const config = this.configs[serviceName];
    if (!config) {
      this.log(serviceName, `Unknown service: ${serviceName}`, 'error');
      return false;
    }

    try {
      // Check if service is already running
      if (this.processes.has(serviceName)) {
        this.log(serviceName, `${config.name} is already running`, 'warning');
        return true;
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

      this.log(serviceName, `${config.name} started successfully`, 'success');
      return true;

    } catch (error) {
      this.log(serviceName, `Failed to start: ${error.message}`, 'error');
      return false;
    }
  }

  // Start all services
  async startAll() {
    console.log(`${colors.bright}🐦 Starting Iris Twitter-Only Platform...${colors.reset}\n`);
    
    const services = Object.keys(this.configs);
    const results = [];
    
    for (const service of services) {
      const result = await this.startService(service);
      results.push({ service, success: result });
    }
    
    // Display results
    console.log(`\n${colors.bright}📊 Startup Results:${colors.reset}`);
    results.forEach(({ service, success }) => {
      const status = success ? '✅ Started' : '❌ Failed';
      const color = success ? colors.green : colors.red;
      console.log(`   ${color}${service.padEnd(20)}${colors.reset} ${status}`);
    });
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    if (successCount === totalCount) {
      console.log(`\n${colors.green}🎉 All services started successfully!${colors.reset}`);
      this.displayStatus();
    } else {
      console.log(`\n${colors.yellow}⚠️ ${successCount}/${totalCount} services started${colors.reset}`);
    }
    
    return successCount === totalCount;
  }

  // Display system status
  displayStatus() {
    console.log(`\n${colors.bright}🐦 Twitter-Only Iris Platform Status:${colors.reset}`);
    console.log(`   🐦 Twitter Automation: ${colors.green}Active${colors.reset}`);
    console.log(`   📅 Posting Schedule: Every 30 minutes`);
    console.log(`   🔄 Content Types: Trending alerts, educational posts, market analysis`);
    console.log(`   💬 Engagement: Polls, questions, community highlights`);
    
    console.log(`\n${colors.bright}⌨️  Controls:${colors.reset}`);
    console.log(`   ${colors.yellow}Ctrl+C${colors.reset}  - Stop all services gracefully`);
    console.log(`   ${colors.yellow}Ctrl+Z${colors.reset}  - Pause all services`);
    console.log(`   ${colors.yellow}Ctrl+\\${colors.reset} - Force stop all services`);
  }

  // Setup signal handlers
  setupSignalHandlers() {
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
      console.log(`\n${colors.green}✅ Twitter-Only Iris Platform stopped successfully after ${runtime} seconds${colors.reset}`);
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGQUIT', () => shutdown('SIGQUIT'));
  }
}

// Main execution
async function main() {
  const orchestrator = new TwitterOnlyOrchestrator();
  
  // Setup signal handlers
  orchestrator.setupSignalHandlers();
  
  // Start all services
  const success = await orchestrator.startAll();
  
  if (success) {
    // Keep the process running
    setInterval(() => {
      // Keep alive
    }, 1000);
  } else {
    console.log(`\n${colors.red}❌ Failed to start all services${colors.reset}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}❌ Fatal error:${colors.reset}`, error);
  process.exit(1);
});
