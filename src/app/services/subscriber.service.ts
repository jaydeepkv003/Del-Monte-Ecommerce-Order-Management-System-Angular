import { Subscription } from 'rxjs';

export interface SubscriptionObject {
  Name: string;
  Subject: Subscription;
}

export function pushSubscription(
  name: string,
  subscriptionList: SubscriptionObject[],
  subscription: Subscription
): void {
  const index = subscriptionList.findIndex((x) => x.Name === name);
  if (index !== -1) {
    subscriptionList[index].Subject.unsubscribe();
    subscriptionList.splice(index, 1);
  }
  subscriptionList.push({ Name: name, Subject: subscription });
}

export function destroySubscriptions(
  subscriptionList: SubscriptionObject[]
): void {
  subscriptionList.forEach((item) => {
    item.Subject.unsubscribe();
  });
}
