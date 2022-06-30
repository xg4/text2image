import {
  Button,
  Card,
  Form,
  Input,
  List,
  Slider,
  Typography,
  Upload,
} from 'antd'
import produce from 'immer'
import { isNil, omitBy } from 'lodash'
import { useState } from 'react'

export default function Control({
  onSubmit,
  title,
}: {
  onSubmit: (options: any) => Promise<any>
  title: string
}) {
  const [images, setImages] = useState<any[]>([])

  const handleSubmit = async (_options: any) => {
    const options = omitBy(_options, isNil)

    const image = await onSubmit(options)

    setImages(
      produce((draft) => {
        draft.push(image)
        return draft
      })
    )
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
  }

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  return (
    <Card title={title} className="container mx-auto shadow-lg">
      <Form
        {...formItemLayout}
        onFinish={handleSubmit}
        initialValues={{
          fontWeight: 500,
          fontSize: 24,
        }}
      >
        <Form.Item
          label="Text"
          name="text"
          rules={[
            {
              required: true,
              message: 'Please input text',
            },
          ]}
        >
          <Input placeholder="Text" />
        </Form.Item>
        <Form.Item label="Font Size" name="fontSize">
          <Slider min={1} max={100} />
        </Form.Item>
        <Form.Item label="Font Weight" name="fontWeight">
          <Slider min={100} step={100} max={900} />
        </Form.Item>

        <Form.Item label="Font Color" name="color">
          <Input type="color"></Input>
        </Form.Item>

        <Form.Item
          label="Image"
          name="imageUrl"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>Upload</div>
          </Upload>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button htmlType="submit" type="primary">
            generate
          </Button>
        </Form.Item>
      </Form>

      <List
        className="overflow-auto"
        bordered
        header={<div className="font-bold text-lg">Showcase</div>}
      >
        {images.map((image, index) => (
          <List.Item
            className="flex flex-wrap flex-col items-start gap-2"
            key={index}
          >
            <img
              className="border border-gray-700 border-solid"
              src={image.url}
              alt="text"
            />
            <Typography.Link
              href={image.url}
              target="_blank"
              className="text-xs"
            >
              {image.url}
            </Typography.Link>

            <Typography.Text code>{image.code}</Typography.Text>
          </List.Item>
        ))}
      </List>
    </Card>
  )
}
