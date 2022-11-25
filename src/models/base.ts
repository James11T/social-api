import { Ok, Err } from "ts-results";
import { BaseEntity } from "typeorm";
import type { Result } from "ts-results";
import type { SaveOptions } from "typeorm";

class BaseModel extends BaseEntity {
  constructor() {
    super();
  }

  async pcallSave(
    options?: SaveOptions
  ): Promise<Result<this, "FAILED_TO_SAVE">> {
    try {
      const res = await this.save(options);
      return Ok(res);
    } catch (err) {
      return Err("FAILED_TO_SAVE");
    }
  }
}

export default BaseModel;
