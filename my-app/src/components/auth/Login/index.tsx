import { FC, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useActions } from "../../../hooks/useActions";
import InputGroup from "../../common/InputGroup";
import { ILoginModel } from "./types";
import { useFormik, Form, FormikProvider } from "formik";
import { LoginSchema } from './validation';
import { captchaKey } from "../../../recaptcha";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage: FC = () => {
    const initialState: ILoginModel = {
        email: "",
        password: "",
        token: ""
    }

    const [error, setError] = useState<string>("");

    const reRef = useRef<ReCAPTCHA>(null);

    const { UserLogin } = useActions();

    const onHandleSubmit = async (
        values: ILoginModel,
        // { setFieldError }: FormikHelpers<ILoginModel>
    ) => {
        try {
            if (values.token) {
                setError("");
                UserLogin(values, setError);
            } else setError("Підтвердіть, що ви не робот");
        } catch (ex) {
            // console.log(ex)
        }
    }

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: LoginSchema,
        onSubmit: onHandleSubmit
    });

    const { errors, touched, handleChange, handleSubmit, setFieldValue } = formik;

    const onChangeCaptcha = (token: string | null) => {
        if (token !== null)
            setFieldValue("token", token);
    }

    return (
        <>
            <h1 className="text-center mt-3">Вхід</h1>
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-10 col-lg-8 col-xl-5 bg-light shadow-lg p-3 bg-white rounded p-4">
                        {error !== "" ?
                            <div className="text-center alert-danger m-1 p-2 rounded shadow-lg">
                                {error}{reRef.current?.reset()}
                            </div> : <></>}
                        <FormikProvider value={formik}>
                            <Form onSubmit={handleSubmit}>
                                <div className="form-group mt-3">
                                    <InputGroup
                                        label="Електронна пошта"
                                        field="email"
                                        error={errors.email}
                                        touched={touched.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <InputGroup
                                        label="Пароль"
                                        field="password"
                                        type="password"
                                        error={errors.password}
                                        touched={touched.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <ReCAPTCHA
                                        sitekey={captchaKey}
                                        size="normal"
                                        onChange={onChangeCaptcha}
                                    />
                                </div>
                                <div className="my-2 text-center">
                                    <button type="submit" className="btn btn-outline-primary btn-lg m-auto px-5">Вхід</button>
                                </div>
                                <div className="my-1 text-center ">
                                    <Link to="/register" className="btn btn btn-outline-success px-3">Створити акаунт</Link>
                                </div>
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;