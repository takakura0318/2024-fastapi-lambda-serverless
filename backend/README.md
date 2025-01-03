# backend

**サマリー**  
1. 初期構築
2. xxx

## 1. 初期セットアップ
- Docker構築
- pyproject.tomlファイルを新規作成
- 
- xxx

### Docker構築
下記2ファイルを新規作成する
- [docker-compose.yml](./docker-compose.yml)
- [Dockerfile.local](./Dockerfile.local)

### pyproject.tomlファイルを新規作成する
[pyproject.toml](./pyproject.toml)

###  動作確認

Dockerコンテナ起動とビルドを行う。
```terminal
// バックエンドコンテナをビルド
backend %  docker-compose up -d --build 
【結果①】
Recreating backend_app_1 ... done
【結果②】
.venvディレクトリが生成される
{PJディレクトリ}
├── .venv
```

動作確認を行う
xxx

---------------

## Alembicの導入
```terminal
// 現在起動中のコンテナを表示する
backend % docker ps
【結果】
CONTAINER_ID NAMES
ffbe01a84ea7

// コンテナに潜る
backend % docker exec -it {コンテナID}  /bin/bash


$ bash-5.2# pwd
【結果】
/var/task 

// alembic初期化
$ alembic init alembic
```