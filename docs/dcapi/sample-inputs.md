# DC API デモ — フォーム入力例

`/dcapi/verify-android` ( `src/components/dcapi/DCApiVerifyAndroidPage.tsx` ) の入力値サンプル。

## サンプル A: `com.vess-api.dev.testoda.mdoc.original.B` の `name.familyName` を取得する

### 期待される DCQL ( authorizationRequest.dcql_query )

```json
{
  "credentials": [
    {
      "id": "com_vess-api_dev_testoda_mdoc_original_B",
      "require_cryptographic_holder_binding": true,
      "multiple": false,
      "format": "mso_mdoc",
      "claims": [
        {
          "id": "name_familyName",
          "path": ["name", "familyName"]
        }
      ],
      "meta": {
        "doctype_value": "com.vess-api.dev.testoda.mdoc.original.B"
      }
    }
  ]
}
```

### フォーム入力値

| 入力欄 | 値 | DCQL 上のどこ |
|---|---|---|
| protocol | `openid4vp-v1-unsigned` (デフォルト) | DCQL外 — `navigator.credentials.get` の protocol |
| response_mode | `dc_api` (デフォルト) | DCQL外 — `authorizationRequest.response_mode` |
| client_id | 任意 (デフォルト `vess-dc-api-demo-verifier` でOK) | DCQL外 — `authorizationRequest.client_id` |
| docType | `com.vess-api.dev.testoda.mdoc.original.B` | `meta.doctype_value` に入る。同時に `.` を `_` に置換した `com_vess-api_dev_testoda_mdoc_original_B` が `credentials[0].id` に入る |
| element 行 #1 namespace | `name` | `claims[0].path[0]`、 `claims[0].id` の前半 |
| element 行 #1 identifier | `familyName` | `claims[0].path[1]`、 `claims[0].id` の後半 |
| element 行 #1 retain | オフ | 提示例には `intent_to_retain` が無いので未チェック |

UI に出ないが固定で出力されるもの:
- `require_cryptographic_holder_binding: true`
- `multiple: false`
- `format: "mso_mdoc"`

### 最短手順

1. docType 欄に `com.vess-api.dev.testoda.mdoc.original.B` と入力 ( datalist サジェストにある )
2. preset により element 行に `namespace=name / identifier=familyName` が自動セット
3. 「Request を構築」
4. 「navigator.credentials.get() を呼び出し」

## 補足

### 複数 namespace を要求する場合

`mdoc` / DCQL は 1 ドキュメント内で複数 namespace の element を同時に要求できる。 element 行を複数追加し、それぞれ別 namespace を指定すれば DCQL の `claims` 配列が複数要素になる。

### iOS Safari の場合

`/dcapi/verify-ios` (protocol: `org-iso-mdoc`) を使う。 こちらは CBOR の `DeviceRequest` を構築する経路で、 namespace は CBOR map のキーになる ( DCQL は使わない )。
