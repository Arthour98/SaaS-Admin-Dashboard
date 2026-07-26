
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "@/components/main.module.css";

export default function InfoItem(
    {content}:
    {
    content:string
    })
{
     
    return(
    <div className={styles.infoWrapper}>
        <FontAwesomeIcon
        icon={faCircleInfo}
        className={styles.infoIcon} />
        <p>{content}</p>
    </div>
    )

}