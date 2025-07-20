# RSS Monitor

RSS Monitor 是一个使用 TypeScript 构建的 RSS/Atom 订阅监控工具。该项目支持定时检测多个 RSS/Atom 订阅源的更新，并在检测到新的内容时，通过邮件发送通知。

---

## 特性

- **定时检测**：
  - 支持按配置的时间间隔定时检测每个 RSS/Atom 订阅更新。
  - 判断和筛选更新内容。

- **邮件通知**：
  - 汇总所有订阅的更新，生成现代化卡片式 HTML 邮件。
  - 通过 SMTP 发送邮件通知，邮件配置信息全部在配置文件中定义。

---

## 目录结构

项目按照模块化设计，典型目录结构如下：

```
rss-monitor/
├── config.yml         # 项目主要配置文件：邮件、更新间隔、订阅列表、日志等级
├── status.yml         # 存储各订阅的最新更新时间（首次运行可为空或不存在）
├── package.json       # Node.js 项目依赖
├── tsconfig.json      # TypeScript 配置文件
└── src/
    ├── config/
    │     ├── Config.ts      # 加载和解析 config.yml 的逻辑
    │     └── Status.ts      # 管理和持久化订阅状态的逻辑
    ├── email/
    │     └── emailSender.ts # 通过 SMTP 发送邮件
    ├── logger/
    │     └── logger.ts      # 彩色日志输出
    ├── parser/
    │     └── feedParser.ts  # RSS/Atom 源解析
    ├── updater/
    │     └── updater.ts     # 定时检测更新、筛选新内容、汇总发送邮件
    └── index.ts             # 应用程序入口
```

---

## 安装与使用

### 1. 克隆代码

```bash
git clone https://github.com/EzioSweet/rss-monitor
cd rss-monitor
```

### 2. 安装依赖

确保你安装了 Node.js 18+和 npm。

```bash
npm install
```

### 3. 配置

你**需要首先**将`config.example.yml`更名为`config.yml`

在项目根目录下，有两个主要yml文件：

- **config.yml**
  配置示例：

  ```yaml
  mail:
    smtp:
      host: smtp.example.com
      port: 465
      user: yourUser
      password: yourPassword
    from: "Notifier <notifier@example.com>"
    to:
      - recipient1@example.com
      - recipient2@example.com
  logLevel: info
  updateInterval: 60000  # 以毫秒为单位，这里为 60 秒
  subscriptions:
    - name: "Tech News"
      url: "https://example.com/rss/tech.xml"
    - name: "World News"
      url: "https://example.com/rss/world.xml"
  ```

- **status.yml**
  用于存储每个订阅的最新更新时间。首次运行可为空或不存在，程序会自动生成。

### 4. 运行程序

使用 `ts-node` 启动应用：

```bash
npm run start
```

程序会立即执行一次更新检测，并以后按照配置的 `updateInterval` 进行定时检测。如果检测到新的 RSS/Atom 更新，会汇总生成一封邮件并发送到配置的收件人列表中。

---

## 调试与日志

日志模块支持以下日志级别：
- `debug`
- `info`
- `warn`
- `error`

通过修改 `config.yml` 中的 `logLevel` 参数来调整日志输出。例如：
```yaml
logLevel: debug
```
这样程序会输出更详细的调试日志，方便排查问题。

---

## License

本项目遵循 Apache 2.0 许可协议，详见 [LICENSE](LICENSE) 文件。

---

## 联系方式

如有疑问或更多讨论，欢迎通过项目 Issue 区进行反馈。

---

