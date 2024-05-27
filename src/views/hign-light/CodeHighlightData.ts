export const jsonCode: string = `{
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "age": {
            "type": "number"
        },
        "address": {
            "type": "object"
        },
        "phoneNumbers": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string"
                    },
                    "number": {
                        "type": "string"
                    }
                },
                "additionalProperties": false
            }
        }
    },
    "additionalProperties": false
}`;

export const jsCode: string = `<template #title>
      <div class="form-title">
        <a-button style="float: left" @click="back"> 返回 </a-button>
        <a-button type="danger" style="float: right" v-if="!isCreate" @click="handleDelete">
          删除
        </a-button>
        <a-button type="primary" :disabled="!id" style="float: right" @click="handlePutIt">
          发布
        </a-button>
        <a-button
          ghost
          type="primary"
          style="float: right"
          :disabled="!id"
          @click="handlePreview"
          :loading="vd.previewLoading"
        >
          预览
        </a-button>
        <a-button style="float: right" @click="handleSave()" :loading="vd.saveLoading">
          保存
        </a-button>
      </div>
    </template>
`;

export const javaCode: string = `package com.lab.standard.entity;

import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;
import java.time.LocalDateTime;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 用户反馈
 * </p>
 *
 * @author jinshengyuan
 * @since 2023-01-06
 */
@Getter
@Setter
@TableName("std_user_feedback")
@ApiModel(value = "反馈对象", description = "标准-用户反馈")
public class StdUserFeedback implements Serializable {

    private static final long serialVersionUID = 1L;
    private String id;

    @ApiModelProperty(value = "用户ID")
    private String userId;

    @ApiModelProperty(value = "用户名")
    private String userName;

    @ApiModelProperty(value = "用户姓名")
    private String fullName;

    @ApiModelProperty(value = "反馈内容")
    private String remarks;

    @ApiModelProperty(value = "反馈时间")
    private LocalDateTime feedbackTime;
}
`;
export const xmlCode: string = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.yuan.standard.mapper.StdUserFeedbackMapper">
    <select id="selectImageInfo" resultType="java.util.HashMap" parameterType="string">
        select * from v_sys_upload where bus_id=#{id} and is_del='0'
    </select>
    <update id="deleteImageInfo">
        update v_sys_upload set is_del=1
        <where>
            id in
            <foreach  collection="ids" item="id" index="index"  open="(" close=")" separator=",">
                #{id}
            </foreach>
        </where>
    </update>
</mapper>
`;

export const yamlCode: string = `server:
  port: 8080
  servlet:
    context-path: /upload
spring:
  servlet:
    multipart:
#      设置最大文件
      max-file-size: 20MB
      max-request-size: 1000MB
  application:
    name: yuan-upload-app`;

export const sqlCode: string = ` SELECT * FROM USER WHERE ID = ?`;
